import { Router } from "express";
import { authorizeRole, verifyToken } from "../../shared/middlewares/auth.middleware";
import { ROLES } from "../../shared/utils/roles";
import { validateBody } from "../../shared/middlewares/validation.middleware";
import { createBuildingSchema, updateBuildingSchema } from "./buildings.schema";
import { getAllBuildings, getBuildingById, createBuilding, updateBuilding, deleteBuilding } from "./building.controller";

const buildingsRouter = Router()

buildingsRouter.use(verifyToken)
buildingsRouter.use(authorizeRole([ROLES.ADMIN]))

buildingsRouter.get('/', getAllBuildings)
buildingsRouter.get('/:id', getBuildingById)
buildingsRouter.post('/', validateBody(createBuildingSchema), createBuilding)
buildingsRouter.put('/:id', validateBody(updateBuildingSchema), updateBuilding)
buildingsRouter.delete('/:id', deleteBuilding)

export default buildingsRouter