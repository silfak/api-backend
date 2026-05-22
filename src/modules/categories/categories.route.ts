import { Router } from "express";
import { createCategorySchema, updateCategorySchema} from "./categories.schema";
import { getAllCategoriesController, getCategoryByIdController, createCategoryController, updateCategoryController, deleteCategoryController } from "./categories.controller";
import { validateBody } from "../../shared/middlewares/validation.middleware";
import { authorizeRole, verifyToken } from "../../shared/middlewares/auth.middleware";
import { ROLES } from "../../shared/utils/roles";

export const categoriesRouter = Router();

categoriesRouter.use(verifyToken);

categoriesRouter.get('/', getAllCategoriesController);
categoriesRouter.get('/:id', getCategoryByIdController);

categoriesRouter.post('/', validateBody(createCategorySchema), authorizeRole([ROLES.ADMIN, ROLES.SUPERADMIN]), createCategoryController);
categoriesRouter.put('/:id', validateBody(updateCategorySchema), authorizeRole([ROLES.ADMIN, ROLES.SUPERADMIN]), updateCategoryController);
categoriesRouter.delete('/:id', authorizeRole([ROLES.ADMIN, ROLES.SUPERADMIN]), deleteCategoryController);    