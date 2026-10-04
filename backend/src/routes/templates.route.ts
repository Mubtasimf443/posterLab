/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Router } from "express";
import TemplatesService from "../services/templates.service.ts";

const router = Router();

router.get('/', TemplatesService.getTemplates);
router.get('/:id', TemplatesService.getTemplate);

export { router as TemplatesRouter };