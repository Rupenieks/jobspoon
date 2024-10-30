import { z } from "zod";
import { ResumeModelSchema } from "../resume/TResume";

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string().nullable(),
  fullName: z.string(),
  googleId: z.string().nullable(),
  picture: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  resumes: z.array(ResumeModelSchema),
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
