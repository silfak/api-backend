import { Router } from "express";
import { authorizeRole, verifyToken } from "../../shared/middlewares/auth.middleware";
import { ROLES } from "../../shared/utils/roles";
import { validateBody } from "../../shared/middlewares/validation.middleware";
import { createRoomSchema, updateRoomSchema } from "./rooms.schema";
import { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } from "./room.controller";

const roomsRouter = Router()

roomsRouter.use(verifyToken)

roomsRouter.get('/', getAllRooms)
roomsRouter.get('/:id', getRoomById)

roomsRouter.post('/', validateBody(createRoomSchema), authorizeRole([ROLES.ADMIN]), createRoom)
roomsRouter.put('/:id', validateBody(updateRoomSchema), authorizeRole([ROLES.ADMIN]), updateRoom)
roomsRouter.delete('/:id', authorizeRole([ROLES.ADMIN]), deleteRoom)

export default roomsRouter
