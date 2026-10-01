/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import type { Request, Response } from "express";
import formidable from 'formidable'
import { unlinkSync } from "fs";
import path from "path";
import uploadImageToCloudinary from "../config/cloudinary.ts";
import { __dirname } from '../config/env.ts';


export default class UploadService{
    static async uploadImage(req: Request, res: Response) {
        try {
            let DontSuffortMime = false;
            let options: formidable.Options = {
                uploadDir: path.resolve(__dirname, '../../uploads'),
                maxFiles: 1,
                allowEmptyFiles: false,
                maxFileSize: 1 * 1024 * 1024,
                filter: (file) => {
                    if (file.mimetype!.startsWith('image/')) return true
                    DontSuffortMime = true
                    return false
                },
                filename: () => Date.now() + '_' + Math.floor(Math.random() * 1000000) + '.jpg'
            }
            await formidable(options).parse(req, async (error, fields, files) => {
                try {
                    if (DontSuffortMime) {
                        return res.status(400).json({ success: false, data: null, error : { message : 'do not support the mimetype'} });
                    }
                    if (error ) {
                        console.error({ error })
                        return res.status(400).json({ success: false, data: null, error });
                    }
                    if (!files?.image || files?.image?.length === 0) {
                        return res.status(400).json({ error: { message: "Please Uplaod A IMAGE" }, success: false, data: null, })
                    }
                    let response =await uploadImageToCloudinary(files.image[0].filepath);
                    if (!response) {
                        return res.status(400).json({
                            error: {
                                message: 'failed to uplaod Image in cloudinary'
                            },
                            success : false ,
                            data : null
                        })
                    }
                    unlinkSync(files.image[0].filepath)
                    return res.status(200).json({ data: { url: response.url }, success: true, error: null })
                } catch (error) {
                    console.error(error);
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error, success: false, data: null })
        }
    }
}