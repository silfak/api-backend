import z from 'zod';

export const usersSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
});

export const userListItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.email(),
  isActive: z.boolean(),
  role: z.object({
    name: z.string(),
  }),
});

export const userByIdSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.email(),
  isActive: z.boolean(),
  role: z.object({
    name: z.string(),
  }),
}); 

export const userUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.email().optional(),
});
