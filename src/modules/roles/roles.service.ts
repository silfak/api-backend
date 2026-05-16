import { db } from '../../shared/db/index.js';
import { Role } from '../../shared/db/schema.js';

export const getRoleByName = async (name: string): Promise<Role | undefined> => {
  const role = await db.query.roles.findFirst({
    where: {
      name: name,
    },
  });

  return role;
};
