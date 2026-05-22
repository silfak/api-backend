import { Request, Response, NextFunction } from 'express';
import { getRoleByName } from '../roles/roles.service';
import { sendSuccess } from '../../shared/utils/response';
import { NotFoundError } from '../../shared/utils/errors';
import {
  activateUserService,
  createUserService,
  deactivateUserService,
  getALLUsersService,
  getUserByIdService,
  getUserByRoleService,
  updateUserService,
} from './users.service';
import { ROLES } from '../../shared/utils/roles';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result;

    if (req.query.role && typeof req.query.role === 'string') {
      result = await getUserByRoleService(req.query.role);
    } else {
      result = await getALLUsersService();
    }

    return sendSuccess(res, result, 'Users fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getUserByIdService(req.params.id as string);
    return sendSuccess(res, result, 'User fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const createOB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await getRoleByName(ROLES.OB);

    if (!role || !role.id) {
      throw new NotFoundError('Role "OB" tidak ditemukan di database.');
    }

    const result = await createUserService({ ...req.body, roleId: role.id });
    return sendSuccess(res, result, 'User created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await getRoleByName(ROLES.ADMIN);

    if (!role || !role.id) {
      throw new NotFoundError('Role "Admin" tidak ditemukan di database.');
    }

    const result = await createUserService({ ...req.body, roleId: role.id });
    return sendSuccess(res, result, 'User created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserByIdService(req.params.id as string);
    const result = await updateUserService(user.id, req.body);
    return sendSuccess(res, result, 'User updated successfully');
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserByIdService(req.params.id as string);
    let result;
    if (user.isActive) {
      result = await deactivateUserService(user.id);
    } else {
      result = await activateUserService(user.id);
    }

    return sendSuccess(res, result, 'User updated successfully');
  } catch (error) {
    next(error);
  }
};
