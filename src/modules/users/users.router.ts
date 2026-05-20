import { Router } from 'express';
import { validateBody } from '../../shared/middlewares/validation.middleware';
import { usersSchema, userUpdateSchema } from './users.schema';
import * as usersController from './users.controller';
import { authorizeRole, verifyToken } from '../../shared/middlewares/auth.middleware';
import { ROLES } from '../../shared/utils/roles';

const usersRouter = Router();

usersRouter.use(verifyToken);
usersRouter.use(authorizeRole([ROLES.ADMIN]));

usersRouter.get('/', usersController.getUsers);
usersRouter.post('/OB', validateBody(usersSchema), usersController.createOB);
usersRouter.get('/:id', usersController.getUserById);
usersRouter.put('/:id', validateBody(userUpdateSchema), usersController.updateUser);
usersRouter.patch('/:id/status', usersController.updateUserStatus);

export default usersRouter;
