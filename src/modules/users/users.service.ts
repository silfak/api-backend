import { db } from '../../shared/db/index.js';
import { users } from '../../shared/db/schema.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { NotFoundError, ConflictError } from '../../shared/utils/errors.js';
import { CreateUserInput, UpdateUserInput } from './users.schema.js';

export const getALLUsersService = async () => {
  const allUsers = await db.query.users.findMany({
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

  return allUsers;
};

export const getUserByRoleService = async (roleName: string) => {
  const usersWithRole = await db.query.users.findMany({
    with: {
      role: {
        columns: {
          name: true,
        },
      },
    },
    orderBy: (users, { desc }) => [desc(users.isActive), desc(users.createdAt)],
    where: {
      role: {
        name: roleName,
      },
    },
    columns: {
      id: true,
      name: true,
      email: true,
      isActive: true,
    },
  });

  return usersWithRole;
};

export const getUserByIdService = async (id: string) => {
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
    throw new NotFoundError('User not found');
  }

  return user;
};


export const createUserService = async (data: CreateUserInput) => {
  const password = await bcrypt.hash(data.password, 10);

  const existingUser = await db.query.users.findFirst({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new ConflictError('User already exists');
  }

  const [user] = await db
    .insert(users)
    .values({ name: data.name, email: data.email, roleId: data.roleId, password, isActive: true, nim: data.nim || null })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      isActive: users.isActive,
    });

  if (!user) {
    throw new Error('User not created');
  }

  return user;
};

export const updateUserService = async (id: string, data: UpdateUserInput) => {
  const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning({
    id: users.id,
    name: users.name,
    email: users.email,
    isActive: users.isActive,
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

export const deactivateUserService = async (id: string) => {
  const [updated] = await db
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

  if (!updated) {
    throw new NotFoundError('User not found');
  }

  return updated;
};

export const activateUserService = async (id: string) => {
  const [updated] = await db
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

  if (!updated) {
    throw new NotFoundError('User not found');
  }

  return updated;
};
