import { pgTable, uuid, varchar, timestamp, unique, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const roles = pgTable('roles', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
});

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    nim: varchar('nim', { length: 255 }).unique(),
    roleId: uuid('role_id')
      .references(() => roles.id)
      .notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at')
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [unique('users_email_unique').on(table.email)],
);

export const buildings = pgTable("buildings", {
  id: uuid().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
});

export const rooms = pgTable("rooms", {
  id: uuid().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  buildingId: uuid("building_id").notNull().references(() => buildings.id),
});

export const categories = pgTable("categories", {
  id: uuid().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
});

export const reports = pgTable("reports", {
  id: uuid().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  roomId: uuid("room_id").notNull().references(() => rooms.id),
  description: varchar({ length: 255 }),
  imageUrl: varchar("image_url", { length: 255 }),
  status: varchar({ length: 50 }),
});
