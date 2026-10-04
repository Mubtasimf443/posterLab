/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Request, Response } from "express";

export default class PosterService {
    static async createPosters(req: Request, res: Response) {
        try {
            
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