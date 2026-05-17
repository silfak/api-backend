import { Router } from 'express';
import { getHealth } from './health/healthController';
import authRouter from './auth/auth.router';
import usersRouter from './users/users.router';
import buildingsRouter from './buildings/buildings.route.js';
import roomsRouter from './rooms/rooms.route.js';

const router = Router();

router.get('/health', getHealth);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/buildings', buildingsRouter);
router.use('/rooms', roomsRouter);

export default router;
