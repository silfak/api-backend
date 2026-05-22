import { createSelectSchema } from "drizzle-orm/zod";
import { reports } from "../../shared/db/schema";
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import z from "zod";
import { STATUS } from "../../shared/utils/status";

extendZodWithOpenApi(z);

export const reportSchema = createSelectSchema(reports);

export const createReportSchema = z.object({
    roomId: z.string().uuid(),
    description: z.string().min(1),
    image: z.any().optional().openapi({ type: 'string', format: 'binary' }),
    status: z.enum(STATUS).default(STATUS.REPORTED).optional(),
    isUrgent: z.preprocess((val) => {
        if (typeof val === 'string') return val === 'true';
        return val;
    }, z.boolean().default(false).optional()),
    categoryId: z.string().uuid(),
});

export const updateReportSchema = z.object({
    roomId: z.string().uuid().optional(),
    description: z.string().min(1).optional(),
    image: z.any()
        .refine((file) => !file || file.size <= 5 * 1024 * 1024, 'Max image size is 5MB.')
        .refine(
            (file) => !file || ['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype),
            'Only .jpg, .jpeg, and .png formats are supported.'
        )
        .optional()
        .openapi({ type: 'string', format: 'binary' }),
    status: z.enum(STATUS).optional(),
    isUrgent: z.preprocess((val) => {
        if (typeof val === 'string') return val === 'true';
        return val;
    }, z.boolean().optional()),
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