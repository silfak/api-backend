import { db } from '../../shared/db/index.js';

export const getRoleByName = async (name) => {
  console.log(name);

  const role = await db.query.roles.findFirst({
    where: {
      name: name,
    },
  });

  return role;
};
