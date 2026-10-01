/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD } from './env.ts';

cloudinary.config({
    api_key : CLOUDINARY_API_KEY,
    api_secret : CLOUDINARY_API_SECRET,
    cloud_name : CLOUDINARY_CLOUD
});


export default async function uploadImageToCloudinary(path: string) {
    try {
        let response = await cloudinary.uploader.upload(path, {
            public_id: `${Date.now()}_${Math.floor(Math.random() * 1e9)}`,
            resource_type: 'image'
        });
        return response
    } catch (error) {
        console.error({ error })
        return false;
    }
}