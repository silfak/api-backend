import { Request, Response, NextFunction } from 'express';
import { changePasswordService, loginService, registerService } from './auth.service';
import { sendSuccess } from '../../shared/utils/response';
import { UnauthorizedError } from '../../shared/utils/errors';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await registerService(req.body);
    return sendSuccess(res, result, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await loginService(req.body);
    return sendSuccess(res, result, 'User logged in successfully');
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedError();
    }
    const result = await changePasswordService(req.user.id, req.body);
    return sendSuccess(res, result, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};
