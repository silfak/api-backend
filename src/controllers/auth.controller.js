import { loginService, registerService } from '../services/auth.service.js';

export const registerController = async (req, res) => {
  try {
    const result = await registerService(req.body);

    return res.json({
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const result = await loginService(req.body);

    return res.json({
      message: 'User logged in successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
