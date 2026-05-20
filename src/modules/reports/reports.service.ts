import { eq } from "drizzle-orm";
import { db } from "../../shared/db"
import { reports } from "../../shared/db/schema";
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

export const updateReport = async (id: string, data: Partial<UpdateReportInput>) => {
    const existingReport = await db.query.reports.findFirst({
        where: {
            id: id
        }
    })

    if (!existingReport) {
        throw new NotFoundError('Report not found')
    }

    const [report] = await db.update(reports).set({
        ...existingReport,
        ...data,
    }).where(eq(reports.id, id)).returning()

    return report
}

export const createReport = async (data: CreateReportInput) => {
    const report = await db.insert(reports).values(data).returning()

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