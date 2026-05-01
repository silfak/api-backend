import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import authRouter from './auth.router.js';
import usersRouter from './users.router.js';

const router = Router();

router.get('/health', getHealth);
router.use('/auth', authRouter);
router.use('/users', usersRouter);

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
