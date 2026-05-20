import { createSelectSchema } from "drizzle-orm/zod";
import { reports } from "../../shared/db/schema";
import z from "zod";
import { STATUS } from "../../shared/utils/status";

export const reportSchema = createSelectSchema(reports);

export const createReportSchema = z.object({
    reporterId: z.string().uuid(),
    roomId: z.string().uuid(),
    description: z.string().min(1),
    imageUrl: z.string().url().optional(),
    status: z.enum(STATUS).default(STATUS.REPORTED).optional(),
    isUrgent: z.boolean().default(false).optional(),
    categoryId: z.string().uuid(),
});

export const updateReportSchema = z.object({
    reporterId: z.string().uuid().optional(),
    roomId: z.string().uuid().optional(),
    description: z.string().min(1).optional(),
    imageUrl: z.string().url().optional(),
    status: z.enum(STATUS).optional(),
    isUrgent: z.boolean().optional(),
    categoryId: z.string().uuid().optional(),
});

export const reportByIdSchema = z.object({
    id: z.string().uuid(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateReportInput = z.infer<typeof updateReportSchema>;
export type ReportByIdInput = z.infer<typeof reportByIdSchema>;
export type ReportList = z.infer<typeof reportSchema>;
export type ReportById = ReportList;