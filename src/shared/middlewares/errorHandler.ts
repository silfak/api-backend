import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

// Extend Error interface for custom status codes
export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(err: AppError, req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return sendError(res, message, statusCode);
}
