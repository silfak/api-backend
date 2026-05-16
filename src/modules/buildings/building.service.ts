import { eq } from "drizzle-orm";
import { db } from "../../shared/db"
import { buildings, rooms } from "../../shared/db/schema";
import { CreateBuildingInput, UpdateBuildingInput } from "./buildings.schema";

export const getAllBuildingsService = async () => {
    const buildings = await db.query.buildings.findMany({
        extras: {
            roomsCount: db.$count(rooms, eq(rooms.buildingId, rooms.id))
        },
    })

    return buildings;
}

export const getBuildingByIdService = async (id: string) => {
    const building = await db.query.buildings.findFirst({
        where: {
            id: id
        },
        extras: {
            roomsCount: db.$count(rooms, eq(rooms.buildingId, rooms.id))
        },
    })

    return building;
}

export const createBuildingService = async (data: CreateBuildingInput) => {
    const [building] = await db.insert(buildings).values({
        name: data.name
    }).returning({
        id: buildings.id,
        name: buildings.name
    })

    return building;
}

export const updateBuildingService = async (id: string, data: UpdateBuildingInput) => {
    const [building] = await db.update(buildings).set(data).where(eq(buildings.id, id)).returning({
        id: buildings.id,
        name: buildings.name,
    })

    return building;
}

export const deleteBuildingService = async (id: string) => {
    const [building] = await db.delete(buildings).where(eq(buildings.id, id)).returning({
        id: buildings.id,
        name: buildings.name,
    })

    return building;
}
