import { Router } from "express";
import { authorizeRole, verifyToken } from "../../shared/middlewares/auth.middleware.js";
import { ROLES } from "../../shared/utils/roles.js";
import { validateBody } from "../../shared/middlewares/validation.middleware.js";
import { createRoomSchema, updateRoomSchema } from "./rooms.schema.js";
import { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } from "./room.controller.js";

const roomsRouter = Router()

roomsRouter.use(verifyToken)
roomsRouter.use(authorizeRole([ROLES.ADMIN]))

roomsRouter.get('/', getAllRooms)
roomsRouter.get('/:id', getRoomById)
roomsRouter.post('/', validateBody(createRoomSchema), createRoom)
roomsRouter.put('/:id', validateBody(updateRoomSchema), updateRoom)
roomsRouter.delete('/:id', deleteRoom)

export default roomsRouter
