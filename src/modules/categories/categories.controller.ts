import { Request, Response, NextFunction } from "express";
import { CreateCategoryInput, UpdateCategoryInput } from "./categories.schema";
import { getAllCategoriesService, getCategoryByIdService, createCategoryService, updateCategoryService, deleteCategoryService } from "./categories.service";
import { sendSuccess } from "../../shared/utils/response";

export const getAllCategoriesController = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await getAllCategoriesService();
        return sendSuccess(res, categories, 'Categories fetched successfully');
    } catch (error) {
        next(error);
    }
}

export const getCategoryByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        const category = await getCategoryByIdService(id);
        return sendSuccess(res, category, 'Category fetched successfully');
    } catch (error) {
        next(error);
    }
}

export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body as CreateCategoryInput;
        const category = await createCategoryService({ name });
        return sendSuccess(res, category, 'Category created successfully', 201);
    } catch (error) {
        next(error);
    }
}

export const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        const { name } = req.body as UpdateCategoryInput;
        const category = await updateCategoryService(id, { name });
        return sendSuccess(res, category, 'Category updated successfully');
    } catch (error) {
        next(error);
    }
}

export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        const category = await deleteCategoryService(id);
        return sendSuccess(res, category, 'Category deleted successfully');
    } catch (error) {
        next(error);
    }
}