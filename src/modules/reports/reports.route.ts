import { Router } from "express";
import { authorizeRole, verifyToken } from "../../shared/middlewares/auth.middleware";
import { ROLES } from "../../shared/utils/roles";
import { validateBody } from "../../shared/middlewares/validation.middleware";
import { createReportSchema, updateReportSchema } from "./reports.schema";
import { 
    getReportsHandler, 
    getReportByIdHandler, 
    createReportHandler, 
    updateReportHandler, 
    deleteReportHandler 
} from "./reports.controller";

const reportsRouter = Router();

reportsRouter.use(verifyToken);

reportsRouter.get('/', getReportsHandler);
reportsRouter.get('/:id', getReportByIdHandler);

reportsRouter.post('/', validateBody(createReportSchema), createReportHandler);
reportsRouter.patch('/:id', validateBody(updateReportSchema), authorizeRole([ROLES.ADMIN, ROLES.OB]), updateReportHandler);
reportsRouter.delete('/:id', authorizeRole([ROLES.ADMIN]), deleteReportHandler);

export default reportsRouter;
