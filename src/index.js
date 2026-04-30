import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import apiRoutes from './routes/index.js';
import { db } from './db/index.js';
import { users } from './db/schema.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Backend API ready' });
});

app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
