import { Response } from 'express';

export function sendSuccess<T = unknown>(res: Response, data: T | null = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(res: Response, message = 'Internal Server Error', statusCode = 500, errors: unknown = null) {
  const response: { success: boolean; message: string; errors?: unknown } = {
    success: false,
    message,
  };
  if (errors) {
    response.errors = errors;
      }
  return res.status(statusCode).json(response);
}
