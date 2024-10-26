import { z } from "zod";
import { ResumeSchema } from "../resume/TResume";

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string().nullable(),
  fullName: z.string(),
  googleId: z.string().nullable(),
  picture: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  resumes: z.array(ResumeSchema),
});

export type TUser = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  resumes: true,
}).partial({
  password: true,
  googleId: true,
  picture: true,
});

export type TCreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  id: z.string().uuid(),
});

export type TUpdateUser = z.infer<typeof UpdateUserSchema>;
