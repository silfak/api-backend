import { db } from '../db/index.js';
import { users } from '../db/schema.js';

export const getALLUsersService = async () => {
  const users = await db.query.users.findMany({
    with: {
      role: {
        columns: {
          name: true,
        },
      },
    },
    orderBy: (users, { desc }) => [desc(users.createdAt), desc(users.isActive)],
    columns: {
      id: true,
      name: true,
      email: true,
      isActive: true,
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
    where: (users, { eq }) => eq(users.id, id),
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
  const user = await db.insert(users).values(data).returning();

  return user;
};

export const updateUserService = async (id, data) => {
  const user = await db.query.users.update({
    where: (users, { eq }) => eq(users.id, id),
    data: data,
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

export const deactivateUserService = async (id) => {
  const updated = await db
    .update(users)
    .set({
      isActive: false,
    })
    .where(eq(users.id, id));

  return updated;
};

export const activateUserService = async (id) => {
  const updated = await db
    .update(users)
    .set({
      isActive: true,
    })
    .where(eq(users.id, id));

  return updated;
};
