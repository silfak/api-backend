import {
  activateUserService,
  createUserService,
  deactivateUserService,
  getALLUsersService,
  getUserByIdService,
} from '../services/users.service.js';

export const getUsers = async (req, res) => {
  try {
    const result = await getALLUsersService();

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

export const createUser = async (req, res) => {
  try {
    const result = await createUserService(req.body);
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
