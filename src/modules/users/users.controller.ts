import { Request, Response } from 'express';
import { getRoleByName } from '../roles/roles.service.js';
import { sendSuccess, sendError } from '../../shared/utils/response.js';
import {
  activateUserService,
  createUserService,
  deactivateUserService,
  getALLUsersService,
  getUserByIdService,
  getUserByRoleService,
  updateUserService,
} from './users.service.js';

export const getUsers = async (req: Request, res: Response) => {
  try {
    let result;

    if (req.query.role && typeof req.query.role === 'string') {
      result = await getUserByRoleService(req.query.role);
    } else {
      result = await getALLUsersService();
    }

    return sendSuccess(res, result, 'Users fetched successfully');
  } catch (error) {
    if (error instanceof Error) {
      return sendError(res, error.message || 'Error', 400);
    }
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const result = await getUserByIdService(req.params.id as string);

    return sendSuccess(res, result, 'User fetched successfully');
  } catch (error) {
    if (error instanceof Error) {
      return sendError(res, error.message || 'Error', 400);
    }
  }
};

export const createOB = async (req: Request, res: Response) => {
  try {
    const role = await getRoleByName('OB');

    if (!role || !role.id) {
      return sendError(res, 'Role "OB" tidak ditemukan di database.', 404);
    }

    const result = await createUserService({ ...req.body, roleId: role.id });

    return sendSuccess(res, result, 'User created successfully');
  } catch (error) {
    if (error instanceof Error) {
      return sendError(res, error.message || 'Error', 400);
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await getUserByIdService(req.params.id as string);
    const result = await updateUserService(user.id, req.body);

    return sendSuccess(res, result, 'User updated successfully');
  } catch (error) {
    if (error instanceof Error) {
      return sendError(res, error.message || 'Error', 400);
    }
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
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
    if (error instanceof Error) {
      return sendError(res, error.message || 'Error', 400);
    }
  }
};
