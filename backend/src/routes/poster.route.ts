/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Router } from "express";
import PosterService from "../services/posters.service.ts";
import userMiddleware from "../middlewares/usersMiddleware.ts";

const router = Router();

router.use(userMiddleware);

router.post('/', PosterService.createPosters);
router.get('/:id', PosterService.getPosterStatus);
router.get('/user/:userId', PosterService.geUserPostersList);

export { router as postersRouter }