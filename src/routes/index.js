import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import userRoutes from './userRoutes.js';

const router = Router();

router.get('/health', getHealth);
router.use('/users', userRoutes);

export default router;
