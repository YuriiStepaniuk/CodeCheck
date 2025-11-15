import z from 'zod';

export const createTeacherSchema = z.object({
  email: z.string(),
  password: z.string().min(8, 'Password should be at least 8 characters'),
  firstName: z.string(),
  lastName: z.string(),
});

export type CreateTeacherSchema = z.infer<typeof createTeacherSchema>;
