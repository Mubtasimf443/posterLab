/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Router } from "express";
import authService from "../services/auth.service.ts";


const router = Router();

router.post('/register', authService.Register);
router.post('/Registration-verification', authService.RegistrationVerification);
router.post('/login', authService.Login);

export { router as authRouter };