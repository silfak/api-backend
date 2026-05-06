import { Router } from 'express';
import { getHealth } from './health/healthController.js';
import { db } from '../shared/db/index.js';
import { users } from '../shared/db/schema.js';
import authRouter from './auth/auth.router.js';
import usersRouter from './users/users.router.js';
import { sendSuccess, sendError } from '../shared/utils/response.js';

const router = Router();

router.get('/health', getHealth);
router.use('/auth', authRouter);
router.use('/users', usersRouter);

router.get('/db-test', async (req, res) => {
  try {
    const result = await db.select().from(users);
    return sendSuccess(res, result);
  } catch (error) {
    console.error(error);
    return sendError(res, error.message, 500);
  }
});

export default router;
