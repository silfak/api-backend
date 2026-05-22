import { Router } from "express";
import { authorizeRole, verifyToken } from "../../shared/middlewares/auth.middleware";
import { ROLES } from "../../shared/utils/roles";
import { validateBody } from "../../shared/middlewares/validation.middleware";
import { createReportSchema, updateReportSchema } from "./reports.schema";
import { uploadMiddleware } from "../../shared/middlewares/upload.middleware";
import {
    getReportsHandler,
    getReportByIdHandler,
    createReportHandler,
    updateReportHandler,
    deleteReportHandler,
    exportReportsCsvHandler,
    getDashboardHandler,
} from "./reports.controller";

const reportsRouter = Router();

reportsRouter.use(verifyToken);

reportsRouter.get('/', getReportsHandler);
reportsRouter.get('/dashboard', authorizeRole([ROLES.ADMIN, ROLES.SUPERADMIN]), getDashboardHandler);
reportsRouter.get('/export/csv', authorizeRole([ROLES.ADMIN, ROLES.SUPERADMIN]), exportReportsCsvHandler);
reportsRouter.get('/:id', getReportByIdHandler);

reportsRouter.post('/', uploadMiddleware.single('image'), validateBody(createReportSchema), createReportHandler);
reportsRouter.patch('/:id', authorizeRole([ROLES.ADMIN, ROLES.OB, ROLES.SUPERADMIN]), uploadMiddleware.single('image'), validateBody(updateReportSchema), updateReportHandler);
reportsRouter.delete('/:id', authorizeRole([ROLES.ADMIN, ROLES.SUPERADMIN]), deleteReportHandler);

export default reportsRouter;