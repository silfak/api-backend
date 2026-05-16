import { Request, Response } from 'express';
import { sendSuccess } from '../../shared/utils/response.js';

export function getHealth(req: Request, res: Response) {
  const data = {
    timestamp: new Date().toISOString(),
  };
  return sendSuccess(res, data, 'API is running');
}
