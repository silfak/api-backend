import { getRoleByName } from '../services/roles.service.js';
import {
  activateUserService,
  createUserService,
  deactivateUserService,
  getALLUsersService,
  getUserByIdService,
  getUserByRoleService,
  updateUserService,
} from '../services/users.service.js';

export const getUsers = async (req, res) => {
  try {
    let result;

    if (req.query.role) {
      result = await getUserByRoleService(req.query.role);
    } else {
      result = await getALLUsersService();
    }

    return res.json({
      message: 'Users fetched successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const result = await getUserByIdService(req.params.id);

    return res.json({
      message: 'User fetched successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const createOB = async (req, res) => {
  try {
    const role = await getRoleByName('OB');

    if (!role || !role.id) {
      return res.status(404).json({
        message: 'Role "OB" tidak ditemukan di database.',
      });
    }

    const result = await createUserService({ ...req.body, roleId: role.id });

    return res.json({
      message: 'User created successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    const result = await updateUserService(user.id, req.body);

    return res.json({
      message: 'User updated successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    const result = await deactivateUserService(user.id);

    return res.json({
      message: 'User deactivated successfully',
      data: result,
    });
  } catch {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const activateUser = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    const result = await activateUserService(user.id);

    return res.json({
      message: 'User deactivated successfully',
      data: result,
    });
  } catch {
    return res.status(400).json({
      message: error.message,
    });
  }
};
