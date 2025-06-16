import { Router } from "express";
import * as apiController from '../controllers/api.controller';

const router = Router();

router.get('/ping', apiController.ping);

export default router;