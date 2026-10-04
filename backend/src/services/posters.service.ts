/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import type{ Request, Response } from "express";
import { createPosterSchema } from "../utils/zod-schema/posters.schema.ts";
import Templates from "../models/Template.ts";

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
            let { title, occasionType, thumbnailUrl, layoutConfig: { photoSlots, textSlots, colorScheme: { primary, secondary, accent } } } = template;
            let { formData: { name, designation, party, district }, uploadedPhotoUrls } = validationResult.data;

           
            return res.status(200).json({ success: true });
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