import cors from 'cors';
import express from 'express';
import { env } from './shared/config/env.js';
import { errorHandler } from './shared/middlewares/errorHandler.js';
import apiRoutes from './modules/index.js';
import { db } from './shared/db/index.js';
import { users } from './shared/db/schema.js';
import { sendSuccess, sendError } from './shared/utils/response.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return sendSuccess(res, null, 'Backend API ready');
});

app.use('/api', apiRoutes);

app.use((req, res) => {
  return sendError(res, 'Route not found', 404);
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
