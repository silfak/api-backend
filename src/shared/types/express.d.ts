import { JwtPayload } from '../middlewares/auth.middleware';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}