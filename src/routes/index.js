import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import userRoutes from './userRoutes.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import authRouter from './auth.router.js';

const router = Router();

router.get('/health', getHealth);
router.use('/users', userRoutes);
router.use('/auth', authRouter)

router.get('/db-test', async (req, res) => {
  try {
    const result = await db.select().from(users);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
