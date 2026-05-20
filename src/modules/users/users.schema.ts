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

export const CreateUserInput = usersSchema.extend({
  roleId: z.string().uuid(),
  nim: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserInput>;
export type UpdateUserInput = z.infer<typeof userUpdateSchema>;
export type UserByIdInput = z.infer<typeof userByIdSchema>;