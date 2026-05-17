import { Router, Request, Response } from 'express';
import { getHealth } from './health/healthController';
import { db } from '../shared/db/index';
import { users } from '../shared/db/schema';
import authRouter from './auth/auth.router';
import usersRouter from './users/users.router';
import { sendSuccess, sendError } from '../shared/utils/response';
import buildingsRouter from './buildings/buildings.route.js';
import roomsRouter from './rooms/rooms.route.js';

const router = Router();

router.get('/health', getHealth);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/buildings', buildingsRouter);
router.use('/rooms', roomsRouter);

router.get('/db-test', async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(users);
    return sendSuccess(res, result);
  } catch (error: any) {
    console.error(error);
    return sendError(res, error.message || 'Database error', 500);
  }
});

export default router;
