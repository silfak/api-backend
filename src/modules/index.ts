import { Router } from 'express';
import { getHealth } from './health/healthController';
import authRouter from './auth/auth.router';
import usersRouter from './users/users.router';
import buildingsRouter from './buildings/buildings.route.js';
import roomsRouter from './rooms/rooms.route.js';
import { categoriesRouter } from './categories/categories.route';

const router = Router();

router.get('/health', getHealth);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/buildings', buildingsRouter);
router.use('/rooms', roomsRouter);
router.use('/categories', categoriesRouter);

export default router;
