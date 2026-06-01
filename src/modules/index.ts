import { Router } from 'express';
import authRouter from './auth/auth.route';
import usersRouter from './users/users.route';
import buildingsRouter from './buildings/buildings.route';
import roomsRouter from './rooms/rooms.route';
import { categoriesRouter } from './categories/categories.route';
import reportsRouter from './reports/reports.route';
import uploadRouter from './upload/upload.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/buildings', buildingsRouter);
router.use('/rooms', roomsRouter);
router.use('/categories', categoriesRouter);
router.use('/reports', reportsRouter);
router.use('/upload', uploadRouter);

export default router;

