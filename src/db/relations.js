import { defineRelations } from 'drizzle-orm';
import * as schema from './schema.js';

export const relations = defineRelations(schema, (r) => ({
  rooms: {
    users: r.many.users({
      from: r.rooms.id.through(r.reports.roomId),
      to: r.users.id.through(r.reports.userId)
    }),
    building: r.one.buildings({
      from: r.rooms.buildingId,
      to: r.buildings.id
    }),
  },
  users: {
    rooms: r.many.rooms(),
    role: r.one.roles({
      from: r.users.roleId,
      to: r.roles.id
    }),
  },
  buildings: {
    rooms: r.many.rooms(),
  },
  roles: {
    users: r.many.users(),
  },
}))
