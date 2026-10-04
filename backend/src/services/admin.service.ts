/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import type { Request, Response } from "express";
import templateSchema from "../utils/zod-schema/templates.schema.ts";
import Templates from "../models/Template.ts";
import { isValidObjectId } from "mongoose";
import Posters from "../models/Poster.ts";
import User from "../models/User.ts";

export default class adminService {
    static async createTemplate(req : Request, res : Response) {
        try {
            let validationResult = templateSchema.safeParse(req.body);
            if (validationResult.error || !validationResult.data) {
                return res.status(400).json({ error: validationResult.error, data: null, success: false });
            }
            const template= await Templates.create(validationResult.data);
            return res.status(200).json({ data: { _id: template._id }, error: null, success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error , data : null , success : false})
        }
    }   
    static async updateTemplate(req : Request, res : Response) {
        try {
            let id = req.params.id;
            if (!isValidObjectId(id)) {
                return res.status(400).json({ error : { message : 'Invalid template id'}, data : null , success : false});
            }
            let validationResult = templateSchema.safeParse(req.body);
            if (validationResult.error || !validationResult.data) {
                return res.status(400).json({ error: validationResult.error, data: null, success: false });
            }
            const template= await Templates.create(validationResult.data);

            await Templates.findByIdAndUpdate(id , validationResult.data);

            return res.status(200).json({ success: true, error: null, data: null });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error , data : null , success : false})
        }
    }   
    static async deleteTemplate(req : Request, res : Response) {
        try {
            let id = req.params.id;
            if (!isValidObjectId(id)) {
                return res.status(400).json({ error : { message : 'Invalid template id'}, data : null , success : false});
            }
            await Templates.findByIdAndDelete(id);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error , data : null , success : false})
        }
    }   
    static async getPosters(req : Request, res : Response) {
        try {
            let posters = await Posters.find().sort({ createdAt: -1 });
            return res.status(200).json({ data: { posters }, error: null, success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error , data : null , success : false})
        }
    }   
     static async getUsers(req : Request, res : Response) {
        try {
            let users = await User.find().sort({ createdAt: -1 });
            return res.status(200).json({ data: { users }, error: null, success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error , data : null , success : false})
        }
    } 

}