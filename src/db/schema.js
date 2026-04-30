import { pgTable, uuid, serial, varchar, timestamp, unique } from 'drizzle-orm/pg-core';
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
    roleId: uuid('role_id').references(() => roles.id),
    createdAt: timestamp('created_at')
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [unique('users_email_unique').on(table.email)],
);
