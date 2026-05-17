import { Request, Response } from 'express';
import { changePasswordService, loginService, registerService } from './auth.service.js';
import { sendSuccess, sendError } from '../../shared/utils/response.js';

export const registerController = async (req: Request, res: Response) => {
  try {
    const result = await registerService(req.body);
    return sendSuccess(res, result, 'User registered successfully');
  } catch (error) {
   if (error instanceof Error)
     return sendError(res, error.message || 'Error', 400);
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);
    return sendSuccess(res, result, 'User logged in successfully');
  } catch (error) {
   if (error instanceof Error)
     return sendError(res, error.message || 'Error', 400);
  }
};

export const changePasswordController = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(res, 'Unauthenticated', 401);
    }
    const result = await changePasswordService(req.user.id, req.body);
    return sendSuccess(res, result, 'Password changed successfully');
  } catch (error) {
   if (error instanceof Error)
     return sendError(res, error.message || 'Error', 400);
  }
};
