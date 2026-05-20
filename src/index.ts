import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { env } from './shared/config/env';
import { errorHandler } from './shared/middlewares/errorHandler';
import apiRoutes from './modules/index';
import { sendSuccess } from './shared/utils/response';
import { NotFoundError } from './shared/utils/errors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  return sendSuccess(res, null, 'Backend API ready');
});

app.use('/api', apiRoutes);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Route not found'));
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
