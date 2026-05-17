import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  // Known application errors — send the proper status code and message.
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown / unexpected errors — hide internals, log for debugging.
  console.error('[UnhandledError]', err);

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}
