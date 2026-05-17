import { Request, Response, NextFunction } from 'express';
import {
  getAllBuildingsService,
  getBuildingByIdService,
  createBuildingService,
  updateBuildingService,
  deleteBuildingService,
} from './building.service';
import { BuildingByIdInput, CreateBuildingInput, UpdateBuildingInput } from './buildings.schema';
import { sendSuccess } from '../../shared/utils/response';

export const getAllBuildings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const buildings = await getAllBuildingsService();
    return sendSuccess(res, buildings, 'Buildings fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getBuildingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as BuildingByIdInput;
    const building = await getBuildingByIdService(id);
    return sendSuccess(res, building, 'Building fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const createBuilding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body as CreateBuildingInput;
    const building = await createBuildingService({ name });
    return sendSuccess(res, building, 'Building created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateBuilding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as BuildingByIdInput;
    const { name } = req.body as UpdateBuildingInput;
    const building = await updateBuildingService(id, { name });
    return sendSuccess(res, building, 'Building updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteBuilding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as BuildingByIdInput;
    const building = await deleteBuildingService(id);
    return sendSuccess(res, building, 'Building deleted successfully');
  } catch (error) {
    next(error);
  }
};
