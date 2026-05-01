import { Router } from 'express';
import { validateBody } from '../middlewares/validation.middleware.js';
import { usersSchema } from '../schemas/users.schema.js';
import * as usersController from '../controllers/users.controller.js';
import { authorizeRole, verifyToken } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/roles.js';

const usersRouter = Router();

usersRouter.use(verifyToken);
usersRouter.use(authorizeRole([ROLES.ADMIN]));

usersRouter.get('/', usersController.getUsers);
usersRouter.post('/OB', validateBody(usersSchema), usersController.createOB);
usersRouter.get('/:id', usersController.getUserById);
usersRouter.put('/:id', validateBody(usersSchema), usersController.updateUser);
usersRouter.patch('/:id/deactivate', usersController.deactivateUser);
usersRouter.patch('/:id/activate', usersController.activateUser);

export default usersRouter;
