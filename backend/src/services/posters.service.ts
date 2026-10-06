/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import type { Request, Response } from "express";
import { createPosterSchema } from "../utils/zod-schema/posters.schema.ts";
import Templates from "../models/Template.ts";
import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config/env.ts";
import getBase64FromCloudinary from "../utils/common/getBase64FromCloudinary.ts";
import uploadImageToCloudinary from "../config/cloudinary.ts";
import Posters from "../models/Poster.ts";

export default class PosterService {
    static async createPosters(req: Request, res: Response) {
        try {
            let validationResult = createPosterSchema.safeParse({ ...req.body, userId: req.user_id! });
            if (validationResult.error || !validationResult.data) {
                return res.status(400).json({ error: validationResult.error, data: null, success: false })
            }
            let template = await Templates.findById(validationResult.data.templateId, 'title occasionType thumbnailUrl layoutConfig ');
            if (!template) {
                return res.status(200).json({ error: { message: 'Invalid Template id' }, success: false, data: null });
            }
            let { title, occasionType, layoutConfig: { photoSlots, textSlots, colorScheme: { primary, secondary, accent } } } = template;
            let { formData: { name, designation, party, district }, uploadedPhotoUrls } = validationResult.data;

            let poster = await Posters.create({
                userId : req.user_id,
                templateId : validationResult.data.templateId,
                formData: { name, designation, party, district },
                uploadedPhotoUrls,
                createdAt : new Date(),
                status: 'generating'
            });

            let ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

            let allImages: string[] = [...uploadedPhotoUrls, ...photoSlots];

            interface IAllImagesPromptData {
                inlineData: {
                    mimeType: string;
                    data: string;
                }
            }

            let allImagesPromptData: IAllImagesPromptData[] = [];

            for (let i = 0; i < allImages.length; i++) {
                const [mimeType, data] = await getBase64FromCloudinary(allImages[i]);
                allImagesPromptData.push({ inlineData: { mimeType, data : data.replace(/^data:.*?;base64,/, "") } });
            }
            let textPrompt = `
            Create a professional event poster in a 3:4 portrait aspect ratio.

            EVENT:
                - Event / Occasion: "${occasionType}"
                - Main headline: "${title}"

            DESIGN STYLE:
                - Style: Retro-modern, energetic, premium, professional political/event poster design.
                - The design should look polished, visually balanced, and suitable for official public/event promotion.
                - Use strong typography, clean composition, subtle retro-inspired graphic elements, and modern visual hierarchy.
                - Create a visually striking composition without making it cluttered.
                - Use the entire canvas effectively.

            COLOR PALETTE:
                - Primary color: ${primary}
                - Secondary color: ${secondary}
                - Accent color: ${accent}
                - Use these colors consistently throughout the poster.
                - Maintain strong contrast between the background and all text.
                - Do not introduce unrelated dominant colors.

            TEXT CONTENT:
            The following text must appear EXACTLY as provided. Do not rewrite, translate, abbreviate, correct, paraphrase, or invent any of the text.

            1. HEADLINE:
            "${title}"

            2. PERSON NAME:
            "${name}"

            3. DESIGNATION:
            "${designation}"

            4. POLITICAL PARTY:
            "${party}"

            5. DISTRICT:
            "${district}"

            6. TEXT SLOTS:
            ${textSlots.map((slot, index) => `${index + 1}. "${slot}"`).join('\n')}

            TEXT LAYOUT:
                - The headline "${title}" must be the most prominent text element.
                - "${name}" should be clearly visible and visually associated with the person's portrait.
                - Place "${designation}" immediately after or below the person's name.
                - Place "${party}" after the designation.
                - Display "${district}" clearly but with less visual emphasis than the headline.
                - Incorporate every text slot exactly as provided.
                - Do not omit any provided text.
                - Do not add any text that was not provided.
                - Do not generate slogans, quotes, dates, locations, captions, hashtags, logos, or decorative words unless they are explicitly provided above.
                - Preserve the exact spelling, capitalization, punctuation, and wording of every provided text value.
                - Make all text highly legible and correctly spelled.
                - Never generate fake, random, garbled, or distorted letters.

            IMAGE INSTRUCTIONS:
                - Image 1 is the user's portrait/photo.
                - Treat Image 1 as the primary person's photograph.
                - Preserve the person's identity and facial features.
                - Do not significantly alter, redraw, distort, or replace the person's face.
                - Place the person naturally and prominently within the poster composition.
                - Any additional provided images are image slots and should be incorporated into the poster where visually appropriate.
                - Do not confuse the user's portrait with other image slots.
                - Do not generate additional people unless they are already present in the provided images.

            COMPOSITION:
            - Create a clear visual hierarchy:
                1. Main headline
                2. User portrait
                3. User name
                4. Designation and political party
                5. District
                6. Additional text slots
                - Keep important text and the person's face away from the edges.
                - Use appropriate spacing, alignment, typography, and visual balance.
                - Avoid overcrowding.
                - Make the poster look like it was designed by a professional graphic designer rather than generated from a generic template.

            QUALITY REQUIREMENTS:
                - High-resolution professional poster appearance.
                - Sharp and clean typography.
                - Correctly rendered text.
                - No distorted letters.
                - No overlapping text.
                - No cropped important text.
                - No distorted faces.
                - No unnecessary decorative elements that interfere with readability.

            STRICT RESTRICTIONS:
                - Do NOT add any additional text.
                - Do NOT invent or modify any provided text.
                - Do NOT add watermarks.
                - Do NOT add logos unless they are provided as an image.
                - Do NOT add fake signatures.
                - Do NOT add random symbols that resemble letters.
                - Do NOT include placeholder text.
            `;

            const response = await ai.models.generateContent({
                model: "gemini-3.8-flash",
                contents: [
                    { text: textPrompt },                                   // the template above
                    ...allImagesPromptData
                ],
                config: {
                    responseModalities: ["IMAGE"],
                    imageConfig: {  },
                },
            });

            const posterBase64 = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
            const PosterMimeType = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.mimeType;

            if (!posterBase64 || !PosterMimeType) {
                poster.status = 'failed';
                await poster.save();

                return res.status(500).json({ 
                    error : { 
                        message : 'Gemini Image Generation api is not working',
                        geminiResponse : response
                    },
                    success : false,
                    data : null
                });
            }

            let cloudinaryResponse = await uploadImageToCloudinary(posterBase64);

            if (!cloudinaryResponse) {
                poster.status = 'failed';
                await poster.save();

                return res.status(500).json({
                    error :{
                        message : 'Failed to upload Image in cloudinary'
                    },
                    success : false,
                    data : null
                })
            }

            poster.generatedImageUrl = cloudinaryResponse.url;
            poster.status='completed';
            await poster.save();

            return res.status(200).json({ 
                success: true,
                data :{
                    poster :{
                        url : cloudinaryResponse.url,
                        aiResponse : response
                    },
                },
                error : null
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false });
        }
    }


    static async getPosterStatus(req: Request, res: Response) {
        try {

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false });
        }
    }
    static async geUserPostersList(req: Request, res: Response) {
        try {

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false });
        }
    }
}