import { Router } from 'express';
import { getUsers } from '../controllers/userController.js';

const userRoutes = Router();

userRoutes.get('/', getUsers);

export default userRoutes;
