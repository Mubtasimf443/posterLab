/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Router } from "express";
import authService from "../services/auth.service.ts";
import userMiddleware from "../middlewares/usersMiddleware.ts";
import adminMiddleware from "../middlewares/adminMiddleware.ts";


const router = Router();

router.post('/register', authService.Register);
router.post('/Registration-verification/:token', authService.RegistrationVerification);
router.post('/login', authService.Login);
router.post('/admin-login', authService.AdminLogin);
router.get('/user-details', userMiddleware, authService.UserDetails);
router.get('/is-admin', adminMiddleware, authService.isAdmin);

export { router as authRouter };