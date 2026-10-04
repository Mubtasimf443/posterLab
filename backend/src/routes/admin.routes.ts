/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Router } from "express";
import adminMiddleware from "../middlewares/adminMiddleware.ts";
import adminService from "../services/admin.service.ts";

const router = Router();
router.use(adminMiddleware);
router.post('/templates', adminService.createTemplate);
router.patch('/templates/:id', adminService.updateTemplate);
router.delete('/templates/:id', adminService.deleteTemplate);
router.get('/posters', adminService.getPosters);
router.get('/users', adminService.getUsers);

export { router as AdminRouter}