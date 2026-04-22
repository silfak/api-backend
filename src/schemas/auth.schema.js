import z from "zod";

export const registerSchema = z.object({
    email: z.email('Invalid email address'),
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    passwordConfirmation: z.string().min(8, 'Password confirmation must be at least 8 characters long'),
})

export const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
})