import { db } from '../../shared/db/index.js';
import { users } from '../../shared/db/schema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getRoleByName } from '../roles/roles.service.js';

export const registerService = async (data) => {
  // cek existing user
  const existingUser = await db.query.users.findFirst({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  // cek password
  if (data.password !== data.passwordConfirmation) {
    throw new Error('Passwords do not match');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const mahasiswaRole = await getRoleByName('MAHASISWA');

  const newUser = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      roleId: mahasiswaRole.id,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      roleId: users.roleId,
    });

  return newUser;
};

export const loginService = async (data) => {
  const user = await db.query.users.findFirst({
    with: {
      role: true,
    },
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error('user not found');
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Email atau password salah');
  }

  const payload = {
    id: user.id,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });

  return token;
};

export const changePasswordService = async (userId, data) => {
  const user = await db.query.users.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('user not found');
  }

  if (data.oldPassword === data.newPassword) {
    throw new Error('Password baru dan password lama tidak boleh sama');
  }

  const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password);

  if (!isPasswordValid) {
    throw new Error('Password lama salah');
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  await db.update(users).set({
    password: hashedPassword,
  });

  return;
};