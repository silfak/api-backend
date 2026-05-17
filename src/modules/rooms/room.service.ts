import { eq } from "drizzle-orm";
import { db } from "../../shared/db/index.js";
import { rooms } from "../../shared/db/schema.js";
import { CreateRoomInput, UpdateRoomInput } from "./rooms.schema.js";
import { NotFoundError } from "../../shared/utils/errors.js";

export const getAllRoomsService = async () => {
    const allRooms = await db.query.rooms.findMany({
        with: {
            building: {
                columns: {
                    id: true,
                    name: true
                }
            }
        }
    });

    return allRooms;
}

export const getRoomByIdService = async (id: string) => {
    const room = await db.query.rooms.findFirst({
        where: {
            id: id
        },
        with: {
            building: {
                columns: {
                    id: true,
                    name: true
                }
            }
        }
    });

    if (!room) {
        throw new NotFoundError('Room not found');
    }

    return room;
}

export const createRoomService = async (data: CreateRoomInput) => {
    const [room] = await db.insert(rooms).values({
        name: data.name,
        buildingId: data.buildingId,
        floor: data.floor,
    }).returning({
        id: rooms.id,
        name: rooms.name,
        buildingId: rooms.buildingId,
        floor: rooms.floor,
    });

    return room;
}

export const updateRoomService = async (id: string, data: UpdateRoomInput) => {
    const [room] = await db.update(rooms).set(data).where(eq(rooms.id, id)).returning({
        id: rooms.id,
        name: rooms.name,
        buildingId: rooms.buildingId,
        floor: rooms.floor,
    });

    if (!room) {
        throw new NotFoundError('Room not found');
    }

    return room;
}

export const deleteRoomService = async (id: string) => {
    const [room] = await db.delete(rooms).where(eq(rooms.id, id)).returning({
        id: rooms.id,
        name: rooms.name,
        buildingId: rooms.buildingId,
        floor: rooms.floor,
    });

    if (!room) {
        throw new NotFoundError('Room not found');
    }

    return room;
}
