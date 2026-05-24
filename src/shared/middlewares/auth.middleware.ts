import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

// Define the shape of the decoded JWT payload
export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
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

    console.log(req.user);

    if (decoded.isActive === false) {
      return next(new UnauthorizedError('Akun anda tidak aktif'));
    }

    next();
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Token sudah expired'));
    }
    if (e instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Token tidak valid'));
    }
    next(e);
  }
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role.name)) {
      return next(new ForbiddenError('Anda tidak memiliki akses untuk melakukan operasi ini'));
    }
    next();
  };
};
