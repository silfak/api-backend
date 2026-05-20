import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	reports: {
		category: r.one.categories({
			from: r.reports.categoryId,
			to: r.categories.id
		}),
		room: r.one.rooms({
			from: r.reports.roomId,
			to: r.rooms.id
		}),
		user: r.one.users({
			from: r.reports.userId,
			to: r.users.id
		}),
	},
	categories: {
		reports: r.many.reports(),
	},
	rooms: {
		reports: r.many.reports(),
		building: r.one.buildings({
			from: r.rooms.buildingId,
			to: r.buildings.id
		}),
	},
	users: {
		reports: r.many.reports(),
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