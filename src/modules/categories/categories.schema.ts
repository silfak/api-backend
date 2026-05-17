import { createSelectSchema } from "drizzle-orm/zod";
import { categories } from "../../shared/db/schema";
import z from "zod";

export const categoriesSchema = createSelectSchema(categories);

export const createCategorySchema = z.object({
    name: z.string().min(1, "Nama kategori harus diisi"),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1, "Nama kategori harus diisi").optional(),
});

export const categoryByIdSchema = z.object({
    id: z.string().uuid(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryByIdInput = z.infer<typeof categoryByIdSchema>;
export type CategoryList = z.infer<typeof categoriesSchema>;
export type CategoryById = CategoryList;