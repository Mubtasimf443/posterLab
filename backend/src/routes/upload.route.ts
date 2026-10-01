/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Router } from "express";
import UploadService from "../services/upload.service.ts";

const router = Router();

router.post('/', UploadService.uploadImage);

export { router as UploadRouter}