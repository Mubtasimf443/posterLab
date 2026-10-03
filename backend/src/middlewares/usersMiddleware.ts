/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import type { NextFunction, Request, Response } from "express";
import z from "zod";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/env.ts";

declare global {
  namespace Express {
    interface Request {
      user_id?: string;
    }
  }
}


export default async function userMiddleware(req:Request, res: Response, next: NextFunction) {
    try {
        let session = z.string().max(2000).parse(req.cookies.login_session);
        let jwtPayload:any = jwt.verify(session, JWT_SECRET!);
        req.user_id=jwtPayload.userID;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error, success: false, data: null })
    }
}