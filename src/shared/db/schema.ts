import { pgTable, uuid, varchar, text, date, integer, boolean, timestamp, foreignKey, primaryKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const buildings = pgTable("buildings", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 100 }).notNull(),
	createdAt: date("created_at").default(sql`now()`),
});

export const categories = pgTable("categories", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 100 }).notNull(),
	createdAt: date("created_at").default(sql`now()`),
});

export const reports = pgTable("reports", {
	id: uuid().defaultRandom().primaryKey(),
	reporterId: uuid("reporter_id").notNull().references(() => users.id),
	roomId: uuid("room_id").notNull().references(() => rooms.id),
	description: varchar({ length: 255 }),
	imageUrl: text("image_url"),
	status: varchar({ length: 50 }),
	isUrgent: boolean("is_urgent").default(false).notNull(),
	categoryId: uuid("category_id").notNull().references(() => categories.id),
	createdAt: timestamp("created_at").default(sql`now()`),
});

export const roles = pgTable("roles", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
});

export const rooms = pgTable("rooms", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 100 }).notNull(),
	buildingId: uuid("building_id").notNull().references(() => buildings.id),
	createdAt: date("created_at").default(sql`now()`),
	floor: integer().notNull(),
});

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
