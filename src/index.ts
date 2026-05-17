import cors from 'cors';
import express, { Request, Response } from 'express';
import { env } from './shared/config/env.js';
import { errorHandler } from './shared/middlewares/errorHandler.js';
import apiRoutes from './modules/index.js';
import { sendSuccess, sendError } from './shared/utils/response.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  return sendSuccess(res, null, 'Backend API ready');
});

app.use('/api', apiRoutes);

app.use((req: Request, res: Response) => {
  return sendError(res, 'Route not found', 404);
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
