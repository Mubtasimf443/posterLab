/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import type { Request, Response } from "express";
import { createPosterSchema } from "../utils/zod-schema/posters.schema.ts";
import Templates from "../models/Template.ts";
import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config/env.ts";
import getBase64FromCloudinary from "../utils/common/getBase64FromCloudinary.ts";
import uploadImageToCloudinary from "../config/cloudinary.ts";
import Posters from "../models/Poster.ts";
import { isValidObjectId } from "mongoose";
import buildPosterPrompt from "../utils/common/buildPosterPrompt.ts";

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
            let textPrompt = buildPosterPrompt({
                title,
                occasionType, 
                textSlots,
                primary,
                secondary,
                accent,
                name,
                designation,
                party,
                district
            });

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
    static async regeneratePoster(req: Request, res: Response) {
        try {
            let posterId= req.params.id;
           
            if (isValidObjectId(posterId) === false) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Invalid Poster Id' },
                    data: null
                })
            }
            let poster= await Posters.findById(posterId);

            if (!poster) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'No Poster found from this poster id' },
                    data: null
                })
            }

            let template = await Templates.findById(poster.templateId, 'title occasionType thumbnailUrl layoutConfig ');
            if (!template) {
                return res.status(200).json({ error: { message: 'Invalid Template id' }, success: false, data: null });
            }
            let { title, occasionType, layoutConfig: { photoSlots, textSlots, colorScheme: { primary, secondary, accent } } } = template;
            let { formData: { name, designation, party, district }, uploadedPhotoUrls } = poster;

            

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
            let textPrompt = buildPosterPrompt({
                title,
                occasionType, 
                textSlots,
                primary,
                secondary,
                accent,
                name,
                designation,
                party,
                district
            });

            poster.status='generating';
            await poster.save();

            
            const response = await ai.models.generateContent({
                model: "gemini-3.8-flash",
                contents: [
                    { text: 'regenerate the poster with prompt'},
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
            let posterId= req.params.id;
           
            if (isValidObjectId(posterId) === false) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Invalid Poster Id' },
                    data: null
                })
            }
            let poster= await Posters.findById(posterId);

            if (!poster) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'No Poster found from this poster id' },
                    data: null
                })
            }

            return res.status(200).json({
                data : {
                    poster : {
                        status : poster.status,
                        image : poster.generatedImageUrl
                    }
                },
                error : null,
                success : true
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false });
        }
    }
    static async geUserPostersList(req: Request, res: Response) {
        try {
            let userId= req.params.userId;

            if (isValidObjectId(userId) === false) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Invalid Poster Id' },
                    data: null
                })
            }

            let posters = await Posters.find({ userId, status: 'completed' }, 'generatedImageUrl status templateId').lean();

            return res.status(200).json({
                error : null,
                data: { posters },
                success : true
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false });
        }
    }
}