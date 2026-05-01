import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export const getALLUsersService = async () => {
  const users = await db.query.users.findMany({
    with: {
      role: {
        columns: {
          name: true,
        },
      },
    },
    orderBy: (users, { desc }) => [desc(users.isActive), desc(users.createdAt)],
    columns: {
      id: true,
      name: true,
      email: true,
      isActive: true,
    },
  });

  return users;
};

export const getUserByRoleService = async (role) => {
  const users = await db.query.users.findMany({
    with: {
      role: {
        columns: {
          name: true,
        },
      },
    },
    where: {
      role: {
        name: role,
      },
    },
  });

  return users;
};

export const getUserByIdService = async (id) => {
  const user = await db.query.users.findFirst({
    with: {
      role: {
        columns: {
          name: true,
        },
      },
    },
    where: {
      id: id,
    },
    columns: {
      id: true,
      name: true,
      email: true,
      isActive: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const createUserService = async (data) => {
  const password = await bcrypt.hash(data.password, 10);

  const existingUser = await db.query.users.findFirst({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = await db
    .insert(users)
    .values({ ...data, password, isActive: true, nim: null })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      isActive: users.id,
    });

  if (!user) {
    throw new Error('User not created');
  }

  return user;
};

export const updateUserService = async (id, data) => {
  const user = await db.update(users).set(data).where(eq(users.id, id)).returning({
    id: users.id,
    name: users.name,
    email: users.email,
    isActive: users.id,
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const deactivateUserService = async (id) => {
  const updated = await db
    .update(users)
    .set({
      isActive: false,
    })
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      isActive: users.isActive,
    });

  return updated;
};

export const activateUserService = async (id) => {
  const updated = await db
    .update(users)
    .set({
      isActive: true,
    })
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      isActive: users.isActive,
    });

  return updated;
};
