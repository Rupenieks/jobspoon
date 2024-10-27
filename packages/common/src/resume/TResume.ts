import { z } from "zod";
import { MatchSchema } from "../match";
import { ApplicationSchema } from "../application";

export const ExperienceSchema = z.object({
  positionTitle: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  company: z.string().optional(),
  contributions: z.array(z.string()).optional(),
});

export const EducationSchema = z.object({
  university: z.string().optional(),
  degree: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const ReferenceSchema = z.object({
  name: z.string().optional(),
  position: z.string().optional(),
  number: z.string().optional(),
  email: z.string().optional(),
});

export const ResumeSchema = z
  .object({
    id: z.string(),
    fullName: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
    positionName: z.string().optional(),
    experience: z.array(ExperienceSchema).optional(),
    education: z.array(EducationSchema).optional(),
    skills: z.array(z.string()).optional(),
    references: z.array(ReferenceSchema).optional(),
    matches: z.array(MatchSchema).optional(),
  })
  .passthrough();

// New ResumeSchemaDTO
export const ResumeSchemaDTO = ResumeSchema.omit({ id: true, matches: true });

export type TResume = z.infer<typeof ResumeSchema>;
export type TResumeDTO = z.infer<typeof ResumeSchemaDTO>;
