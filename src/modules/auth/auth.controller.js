import { changePasswordService, loginService, registerService } from './auth.service.js';
import { sendSuccess, sendError } from '../../shared/utils/response.js';

export const registerController = async (req, res) => {
  try {
    const result = await registerService(req.body);
    return sendSuccess(res, result, 'User registered successfully');
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

export const loginController = async (req, res) => {
  try {
    const result = await loginService(req.body);
    return sendSuccess(res, result, 'User logged in successfully');
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const result = await changePasswordService(req.user.id, req.body);
    return sendSuccess(res, result, 'Password changed successfully');
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};