import { Request, Response } from "express";
import { getAllRoomsService, getRoomByIdService, createRoomService, updateRoomService, deleteRoomService } from "./room.service.js";
import { RoomByIdInput, CreateRoomInput, UpdateRoomInput } from "./rooms.schema.js";
import { sendError, sendSuccess } from "../../shared/utils/response.js";

export const getAllRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await getAllRoomsService();
        return sendSuccess(res, rooms, 'Rooms fetched successfully');
    } catch (error: any) {
        return sendError(res, error.message || 'Error', 400, error);
    }
}

export const getRoomById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as RoomByIdInput;
        const room = await getRoomByIdService(id);
        return sendSuccess(res, room, 'Room fetched successfully');
    } catch (error: any) {
        return sendError(res, error.message || 'Error', 400, error);
    }
}

export const createRoom = async (req: Request, res: Response) => {
    try {
        const { name, buildingId, floor } = req.body as CreateRoomInput;
        const room = await createRoomService({ name, buildingId, floor });
        return sendSuccess(res, room, 'Room created successfully');
    } catch (error: any) {
        return sendError(res, error.message || 'Error', 400, error);
    }
}

export const updateRoom = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as RoomByIdInput;
        const { name, buildingId, floor } = req.body as UpdateRoomInput;
        const room = await updateRoomService(id, { name, buildingId, floor });
        return sendSuccess(res, room, 'Room updated successfully');
    } catch (error: any) {
        return sendError(res, error.message || 'Error', 400, error);
    }
}

export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as RoomByIdInput;
        const room = await deleteRoomService(id);
        return sendSuccess(res, room, 'Room deleted successfully');
    } catch (error: any) {
        return sendError(res, error.message || 'Error', 400, error);
    }
}
