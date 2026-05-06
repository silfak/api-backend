import { ZodError } from 'zod';
import { sendError } from '../utils/response.js';

export const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      // Parse & validate body
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format error messages
        const errorMessages = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return sendError(res, 'Validation failed', 400, errorMessages);
      }
      next(error);
    }
  };
};
