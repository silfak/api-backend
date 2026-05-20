import { db } from '../../shared/db/index.js';

export const getRoleByName = async (name: string) => {
  const role = await db.query.roles.findFirst({
    where: {
      name: name,
    },
  });

  return role;
};
