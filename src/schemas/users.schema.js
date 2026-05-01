import z from "zod";

export const usersSchema = z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(8),
})