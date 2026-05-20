import { Request, Response, NextFunction } from "express";
import { getAllRoomsService, getRoomByIdService, createRoomService, updateRoomService, deleteRoomService } from "./room.service";
import { RoomByIdInput, CreateRoomInput, UpdateRoomInput } from "./rooms.schema";
import { sendSuccess } from "../../shared/utils/response";

export const getAllRooms = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const rooms = await getAllRoomsService();
        return sendSuccess(res, rooms, 'Rooms fetched successfully');
    } catch (error) {
        next(error);
    }
}

export const getRoomById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as RoomByIdInput;
        const room = await getRoomByIdService(id);
        return sendSuccess(res, room, 'Room fetched successfully');
    } catch (error) {
        next(error);
    }
}

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, buildingId, floor } = req.body as CreateRoomInput;
        const room = await createRoomService({ name, buildingId, floor });
        return sendSuccess(res, room, 'Room created successfully', 201);
    } catch (error) {
        next(error);
    }
}

export const updateRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as RoomByIdInput;
        const { name, buildingId, floor } = req.body as UpdateRoomInput;
        const room = await updateRoomService(id, { name, buildingId, floor });
        return sendSuccess(res, room, 'Room updated successfully');
    } catch (error) {
        next(error);
    }
}

export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as RoomByIdInput;
        const room = await deleteRoomService(id);
        return sendSuccess(res, room, 'Room deleted successfully');
    } catch (error) {
        next(error);
    }
}
