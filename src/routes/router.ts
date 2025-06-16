import { Router } from "express";
import * as apiController from '../controllers/api.controller';
import { privateRoute } from "../config/passport";

const router = Router();

router.get('/ping', apiController.ping);
router.post('/register', apiController.register);
router.post('/login', apiController.login);
router.get('/users', privateRoute, apiController.users);

export default router;