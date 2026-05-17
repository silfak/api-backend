import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { sendError } from '../utils/response.js';

const JWT_SECRET = process.env.JWT_SECRET || '';

// Define the shape of the decoded JWT payload
export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'unauthenticated', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      return sendError(res, 'Token tidak valid atau sudah expired.', 401);
    } else {
      return sendError(res, 'Internal server error', 500);
    }
  }
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role.name)) {
      return sendError(res, 'Forbidden', 403);
    }
    next();
  };
};
