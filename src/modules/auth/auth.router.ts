import { Router } from 'express';
import { changePasswordController, loginController, registerController } from './auth.controller';
import { validateBody } from '../../shared/middlewares/validation.middleware';
import { changePasswordSchema, loginSchema, registerSchema } from './auth.schema';
import { verifyToken } from '../../shared/middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), registerController);
authRouter.post('/login', validateBody(loginSchema), loginController);
authRouter.put('/change-password', verifyToken, validateBody(changePasswordSchema), changePasswordController);

export default authRouter;
