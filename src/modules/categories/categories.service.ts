import { eq } from "drizzle-orm";
import { db } from "../../shared/db"
import { categories } from "../../shared/db/schema";
import { CreateCategoryInput, UpdateCategoryInput } from "./categories.schema";
import { NotFoundError } from "../../shared/utils/errors";

export const getAllCategoriesService = async () => {
    const categories = await db.query.categories.findMany();

    return categories;
}

export const getCategoryByIdService = async (id: string) => {
    const category = await db.query.categories.findFirst({
        where: {
            id: id
        }
    });

    if (!category) {
        throw new NotFoundError("Category not found");
    }

    return category;
}

export const createCategoryService = async (data: CreateCategoryInput) => {
    const category = await db.insert(categories).values(data).returning();
    return category;
}

export const updateCategoryService = async (id: string, data: UpdateCategoryInput) => {
    const category = await db.query.categories.findFirst({
        where: {
            id: id
        }
    });

    if (!category) {
        throw new NotFoundError("Category not found");
    }

    const updatedCategory = await db.update(categories).set(data).where(eq(categories.id, id)).returning();

    if (!updatedCategory) {
        throw new NotFoundError("Category not found");
    }

    return updatedCategory;
}

export const deleteCategoryService = async (id: string) => {
    const category = await db.query.categories.findFirst({
        where: {
            id: id
        }
    });

    if (!category) {
        throw new NotFoundError("Category not found");
    }

    const deletedCategory = await db.delete(categories).where(eq(categories.id, id)).returning();

    return deletedCategory;
}
