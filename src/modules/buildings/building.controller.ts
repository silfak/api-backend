import { Request, Response } from 'express';
import {
  getAllBuildingsService,
  getBuildingByIdService,
  createBuildingService,
  updateBuildingService,
  deleteBuildingService,
} from './building.service';
import { BuildingByIdInput, CreateBuildingInput, UpdateBuildingInput } from './buildings.schema';
import { sendError, sendSuccess } from '../../shared/utils/response';

export const getAllBuildings = async (req: Request, res: Response) => {
  try {
    const buildings = await getAllBuildingsService();
    return sendSuccess(res, buildings, 'Buildings fetched successfully');
  } catch (error) {
    if (error instanceof Error) {
      return sendError(res, error.message || 'Error', 400);
    }
  }
};

export const getBuildingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as BuildingByIdInput;
    const building = await getBuildingByIdService(id);
    
    return sendSuccess(res, building, 'Building fetched successfully');
  } catch (error) {
    if (error instanceof Error) {
      return sendError(res, error.message || 'Error', 400);
    }
  }
};

export const createBuilding = async (req: Request, res: Response) => {
  try {
    const { name } = req.body as CreateBuildingInput;
    const building = await createBuildingService({ name });
    return sendSuccess(res, building, 'Building created successfully');
  } catch (error) {
    if (error instanceof Error) {
      return sendError(res, error.message || 'Error', 400);
    }
  }
};

export const updateBuilding = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as BuildingByIdInput;
    const { name } = req.body as UpdateBuildingInput;
    const building = await updateBuildingService(id, { name });
    return sendSuccess(res, building, 'Building updated successfully');
  } catch (error) {
    if (error instanceof Error) {
      return sendError(res, error.message || 'Error', 400);
    }
  }
};

export const deleteBuilding = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as BuildingByIdInput;
    const building = await deleteBuildingService(id);
    return sendSuccess(res, building, 'Building deleted successfully');
  } catch (error) {
    if (error instanceof Error) {
      return sendError(res, error.message || 'Error', 400);
    }
  }
};
