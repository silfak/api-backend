import { Router } from 'express';
import { validateBody } from '../../shared/middlewares/validation.middleware.js';
import { usersSchema, userUpdateSchema } from './users.schema.js';
import * as usersController from './users.controller.js';
import { authorizeRole, verifyToken } from '../../shared/middlewares/auth.middleware.js';
import { ROLES } from '../../shared/utils/roles.js';

const usersRouter = Router();

usersRouter.use(verifyToken);
usersRouter.use(authorizeRole([ROLES.ADMIN]));

usersRouter.get('/', usersController.getUsers);
usersRouter.post('/OB', validateBody(usersSchema), usersController.createOB);
usersRouter.get('/:id', usersController.getUserById);
usersRouter.put('/:id', validateBody(userUpdateSchema), usersController.updateUser);
usersRouter.patch('/:id/status', usersController.updateUserStatus);

export default usersRouter;
