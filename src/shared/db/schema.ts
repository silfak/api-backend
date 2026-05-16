import { pgTable, uuid, varchar, date, integer, boolean, timestamp, foreignKey, primaryKey, unique } from "drizzle-orm/pg-core"
import { sql, InferSelectModel, InferInsertModel } from "drizzle-orm"



export const buildings = pgTable("buildings", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 100 }).notNull(),
	createdAt: date("created_at").default(sql`now()`),
});
export type Building = InferSelectModel<typeof buildings>;
export type NewBuilding = InferInsertModel<typeof buildings>;

export const categories = pgTable("categories", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 100 }).notNull(),
	createdAt: date("created_at").default(sql`now()`),
});
export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export const reports = pgTable("reports", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull().references(() => users.id),
	roomId: uuid("room_id").notNull().references(() => rooms.id),
	description: varchar({ length: 255 }),
	imageUrl: varchar("image_url", { length: 255 }),
	status: varchar({ length: 50 }),
	isUrgent: boolean("is_urgent").default(false).notNull(),
});
export type Report = InferSelectModel<typeof reports>;
export type NewReport = InferInsertModel<typeof reports>;

export const roles = pgTable("roles", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
});
export type Role = InferSelectModel<typeof roles>;
export type NewRole = InferInsertModel<typeof roles>;

export const rooms = pgTable("rooms", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 100 }).notNull(),
	buildingId: uuid("building_id").notNull().references(() => buildings.id),
	createdAt: date("created_at").default(sql`now()`),
	floor: integer().notNull(),
});
export type Room = InferSelectModel<typeof rooms>;
export type NewRoom = InferInsertModel<typeof rooms>;

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	roleId: uuid("role_id").references(() => roles.id),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	nim: varchar({ length: 255 }),
}, (table) => [
	unique("users_email_unique").on(table.email),	unique("users_nim_key").on(table.nim),]);
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
