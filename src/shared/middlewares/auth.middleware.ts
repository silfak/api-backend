import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';

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

export const verifyToken = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token tidak ditemukan'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      return next(new UnauthorizedError('Token sudah expired'));
    }
    if (e instanceof JsonWebTokenError) {
      return next(new UnauthorizedError('Token tidak valid'));
    }
    next(e);
  }
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role.name)) {
      return next(new ForbiddenError('Anda tidak memiliki akses ke resource ini'));
    }
    next();
  };
};
