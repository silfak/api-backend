import { eq, getColumns, sql } from 'drizzle-orm';
import { db } from '../../shared/db';
import { buildings, rooms } from '../../shared/db/schema';
import { CreateBuildingInput, UpdateBuildingInput } from './buildings.schema';
import { NotFoundError } from '../../shared/utils/errors';

export const getAllBuildingsService = async () => {
  const buildingsList = await db
    .select({
      ...getColumns(buildings),
      roomsCount: sql<number>`COUNT(${rooms.id})::int`,
    })
    .from(buildings)
    .leftJoin(rooms, eq(rooms.buildingId, buildings.id))
    .groupBy(buildings.id);

  return buildingsList;
};

export const getBuildingByIdService = async (id: string) => {
  const building = await db.query.buildings.findFirst({
    where: {
      id: id,
    },
    with: {
      rooms: {
        columns: {
          id: true,
          name: true,
          floor: true,
          createdAt: true,
        },
      },
    },
  });

  if (!building) {
    throw new NotFoundError('Building not found');
  }

  return building;
};

export const createBuildingService = async (data: CreateBuildingInput) => {
  const [building] = await db
    .insert(buildings)
    .values({
      name: data.name,
    })
    .returning({
      id: buildings.id,
      name: buildings.name,
    });

  return building;
};

export const updateBuildingService = async (id: string, data: UpdateBuildingInput) => {
  const [building] = await db.update(buildings).set(data).where(eq(buildings.id, id)).returning({
    id: buildings.id,
    name: buildings.name,
  });

  if (!building) {
    throw new NotFoundError('Building not found');
  }

  return building;
};

export const deleteBuildingService = async (id: string) => {
  const [building] = await db.delete(buildings).where(eq(buildings.id, id)).returning({
    id: buildings.id,
    name: buildings.name,
  });

  if (!building) {
    throw new NotFoundError('Building not found');
  }

  return building;
};
