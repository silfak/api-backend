import { createSelectSchema } from "drizzle-orm/zod";
import { rooms } from "../../shared/db/schema.js";
import z from "zod";

export const roomSchema = createSelectSchema(rooms);

export const createRoomSchema = z.object({
  name: z.string().min(1, "Nama ruangan harus diisi"),
  buildingId: z.string().uuid("Building ID tidak valid"),
  floor: z.number().int("Lantai harus berupa angka"),
});

export const updateRoomSchema = z.object({
  name: z.string().min(1, "Nama ruangan harus diisi").optional(),
  buildingId: z.string().uuid("Building ID tidak valid").optional(),
  floor: z.number().int("Lantai harus berupa angka").optional(),
});

export const roomByIdSchema = z.object({
  id: z.string().uuid(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type RoomByIdInput = z.infer<typeof roomByIdSchema>;
export type RoomList = z.infer<typeof roomSchema>;
export type RoomById = RoomList;
