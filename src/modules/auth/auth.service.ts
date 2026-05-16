import { db } from '../../shared/db';
import { users } from '../../shared/db/schema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getRoleByName } from '../roles/roles.service';
import { eq } from 'drizzle-orm';
import { RegisterInput, LoginInput, ChangePasswordInput } from './auth.schema';

export const registerService = async (data: RegisterInput) => {
  const existingUser = await db.query.users.findFirst({
    where: {
      email: data.email
    }
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const existingNim = await db.query.users.findFirst({
    where: {
      nim: data.nim
    }
  });

  if (existingNim) {
    throw new Error('NIM already exists');
  }

  if (data.password !== data.passwordConfirmation) {
    throw new Error('Passwords do not match');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const mahasiswaRole = await getRoleByName('MAHASISWA');

  if (!mahasiswaRole) {
    throw new Error('Role MAHASISWA not found');
  }

  const [newUser] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      roleId: mahasiswaRole.id,
      nim: data.nim,
    })
    .returning({
      id: users.id,
      name: users.name,
      nim: users.nim,
      email: users.email,
    });

  return newUser;
};

export const loginService = async (data: LoginInput) => {
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
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const JWT_SECRET = process.env.JWT_SECRET || '';
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '3d' });

  return token;
};

export const changePasswordService = async (userId: string, data: ChangePasswordInput) => {
  const user = await db.query.users.findFirst({
    where: {
      id: userId,
    }
  });

  if (!user) {
    throw new Error('user not found');
  }

  if (data.oldPassword === data.newPassword) {
    throw new Error('Password baru dan password lama tidak boleh sama');
  }

  if (data.newPassword !== data.passwordConfirmation) {
    throw new Error('Password baru dan konfirmasi tidak cocok');
  }

  const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password);

  if (!isPasswordValid) {
    throw new Error('Password lama salah');
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  await db.update(users).set({
    password: hashedPassword,
  }).where(eq(users.id, userId));

  return;
};
