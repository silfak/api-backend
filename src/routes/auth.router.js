import { Router } from 'express';
import { loginController, registerController } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), registerController);
authRouter.post('/login', validateBody(loginSchema), loginController);

export default authRouter;
