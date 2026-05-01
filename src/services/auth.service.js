import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getRoleByName } from './roles.service.js';

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
