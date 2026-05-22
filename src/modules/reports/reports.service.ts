import { eq, sql } from "drizzle-orm";
import { db } from "../../shared/db"
import { reports, categories, rooms, buildings, users } from "../../shared/db/schema";
import { NotFoundError } from "../../shared/utils/errors";
import { CreateReportInput, UpdateReportInput } from "./reports.schema";

export const getAllReports = async () => {
    const reports = await db.query.reports.findMany()

    return reports;
}

export const getReportById = async (id: string) => {
    const report = await db.query.reports.findFirst({
        with: {
            room: {
                with: {
                    building: true,
                },
            },
            category: true,
            reporter: {
                columns: {
                    id: true,
                    name: true,
                    email: true,
                },
                with: {
                    role: {
                        columns: {
                            id: true,
                            name: true,
                        }
                    }
                }
            },
        },
        where: {
            id: id
        },
        columns: {
            id: true,
            description: true,
            status: true,
            imageUrl: true,
            isUrgent: true
        }
    })

    if (!report) {
        throw new NotFoundError('Report not found')
    }

    return report

}

export const updateReport = async (id: string, data: Partial<UpdateReportInput> & { imageUrl?: string }) => {
    const existingReport = await db.query.reports.findFirst({
        where: {
            id: id
        }
    })

    if (!existingReport) {
        throw new NotFoundError('Report not found')
    }

    const roomExists = await db.query.rooms.findFirst({
        where: {
            id: data.roomId
        }
    });
    if (!roomExists) throw new NotFoundError('Room not found');

    const categoryExists = await db.query.categories.findFirst({
        where: {
            id: data.categoryId
        }
    });
    if (!categoryExists) throw new NotFoundError('Category not found');
    const [report] = await db.update(reports).set({
        ...existingReport,
        ...data,
    }).where(eq(reports.id, id)).returning()

    return report
}

export const createReport = async (data: CreateReportInput & { imageUrl?: string }, reporterId: string) => {
    const roomExists = await db.query.rooms.findFirst({
        where: {
            id: data.roomId
        }
    });
    if (!roomExists) throw new NotFoundError('Room not found');

    const categoryExists = await db.query.categories.findFirst({
        where: {
            id: data.categoryId
        }
    });
    if (!categoryExists) throw new NotFoundError('Category not found');

    const [report] = await db.insert(reports).values({
        ...data,
        reporterId,
    }).returning()

    return report
}

export const deleteReport = async (id: string) => {
    const existingReport = await db.query.reports.findFirst({
        where: {
            id: id
        }
    })

    if (!existingReport) {
        throw new NotFoundError('Report not found')
    }

    const report = await db.delete(reports).where(eq(reports.id, id)).returning()

    return report
}

export const getDashboardStats = async () => {
    // 1. Summary counts using conditional aggregation
    const [summary] = await db
        .select({
            totalReports: sql<number>`cast(count(*) as int)`,
            pendingReports: sql<number>`cast(count(case when ${reports.status} in ('REPORTED', 'IN_PROGRESS') then 1 end) as int)`,
            resolvedReports: sql<number>`cast(count(case when ${reports.status} = 'RESOLVED' then 1 end) as int)`,
        })
        .from(reports);

    // 2. Category trend – report count per category
    const categoryTrend = await db
        .select({
            categoryName: categories.name,
            count: sql<number>`cast(count(*) as int)`,
        })
        .from(reports)
        .innerJoin(categories, eq(reports.categoryId, categories.id))
        .groupBy(categories.name)
        .orderBy(sql`count(*) desc`);

    // 3. Top 3 rooms with the most reports
    const topRooms = await db
        .select({
            roomName: rooms.name,
            floor: rooms.floor,
            buildingName: buildings.name,
            count: sql<number>`cast(count(*) as int)`,
        })
        .from(reports)
        .innerJoin(rooms, eq(reports.roomId, rooms.id))
        .innerJoin(buildings, eq(rooms.buildingId, buildings.id))
        .groupBy(rooms.name, rooms.floor, buildings.name)
        .orderBy(sql`count(*) desc`)
        .limit(3);

    return {
        summary,
        categoryTrend,
        topRooms,
    };
}

export const getReportsForExport = async (month?: number, year?: number) => {
    const conditions = [eq(reports.roomId, rooms.id), eq(rooms.buildingId, buildings.id), eq(reports.categoryId, categories.id), eq(reports.reporterId, users.id)];

    if (month && year) {
        conditions.push(sql`extract(month from ${reports.createdAt}) = ${month}`);
        conditions.push(sql`extract(year from ${reports.createdAt}) = ${year}`);
    } else if (year) {
        conditions.push(sql`extract(year from ${reports.createdAt}) = ${year}`);
    }

    const allReports = await db
        .select({
            id: reports.id,
            description: reports.description,
            status: reports.status,
            isUrgent: reports.isUrgent,
            imageUrl: reports.imageUrl,
            createdAt: reports.createdAt,
            categoryName: categories.name,
            roomName: rooms.name,
            floor: rooms.floor,
            buildingName: buildings.name,
            reporterName: users.name,
            reporterEmail: users.email,
        })
        .from(reports)
        .innerJoin(rooms, eq(reports.roomId, rooms.id))
        .innerJoin(buildings, eq(rooms.buildingId, buildings.id))
        .innerJoin(categories, eq(reports.categoryId, categories.id))
        .innerJoin(users, eq(reports.reporterId, users.id))
        .where(sql.join(conditions, sql` and `));

    return allReports;
}