/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import type { Request, Response } from "express";
import Templates from "../models/Template.ts";
import { isValidObjectId } from "mongoose";
import z from "zod";
import { bangladeshiOccasions } from "../data/occasions.ts";

export default class TemplatesService{
    static async getTemplates(req:Request, res:Response) {
        try {
            let occasionType = z.enum(bangladeshiOccasions).optional().parse(req.query.occasion);
            let templates = await Templates.find(!!occasionType ? { occasionType } : {}).sort({ createdAt: -1 });
            return res.status(200).json({ data: {templates}, error : null , success : true })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false })
        }
    }
    static async getTemplate(req: Request, res: Response) {
        try {
            let id = req.params.id;
            if (isValidObjectId(id) === false) {
                return res.status(400).json({ error: { message: 'Invalid Template id' } })
            }
            let template = await Templates.findById(id.toString().trim());
            if (!template) return res.status(404).json({ error: { message: 'No Template found from this id' }, data: null, success: false });
            else return res.status(200).json({ data: { template }, error: null, success: true })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, data: null, success: false })
        }
    }
}