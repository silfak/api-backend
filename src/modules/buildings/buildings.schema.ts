/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSelectSchema } from "drizzle-orm/zod";
import { buildings } from "../../shared/db/schema";
import z from "zod";

const selectBuildings = createSelectSchema(buildings);

export const createBuildingSchema = z.object({
  name: z.string().min(1, "Nama gedung harus diisi"),
});

export const updateBuildingSchema = z.object({
  name: z.string().min(1, "Nama gedung harus diisi").optional(),
});

export const buildingByIdSchema = z.object({
  id: z.string().uuid(),
});

export type CreateBuildingInput = z.infer<typeof createBuildingSchema>;
export type UpdateBuildingInput = z.infer<typeof updateBuildingSchema>;
export type BuildingByIdInput = z.infer<typeof buildingByIdSchema>;
export type BuildingList = z.infer<typeof selectBuildings>;
export type BuildingById = BuildingList;