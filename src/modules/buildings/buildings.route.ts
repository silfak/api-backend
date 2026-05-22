import { Router } from "express";
import { authorizeRole, verifyToken } from "../../shared/middlewares/auth.middleware";
import { ROLES } from "../../shared/utils/roles";
import { validateBody } from "../../shared/middlewares/validation.middleware";
import { createBuildingSchema, updateBuildingSchema } from "./buildings.schema";
import { getAllBuildings, getBuildingById, createBuilding, updateBuilding, deleteBuilding } from "./building.controller";

const buildingsRouter = Router()

buildingsRouter.use(verifyToken)

buildingsRouter.get('/', getAllBuildings)
buildingsRouter.get('/:id', getBuildingById)

buildingsRouter.post('/', validateBody(createBuildingSchema), authorizeRole([ROLES.ADMIN, ROLES.SUPERADMIN]), createBuilding)
buildingsRouter.put('/:id', validateBody(updateBuildingSchema), authorizeRole([ROLES.ADMIN, ROLES.SUPERADMIN]), updateBuilding)
buildingsRouter.delete('/:id', authorizeRole([ROLES.ADMIN, ROLES.SUPERADMIN]), deleteBuilding)

export default buildingsRouter