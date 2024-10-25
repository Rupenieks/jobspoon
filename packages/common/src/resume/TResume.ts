import { z } from "zod";

export const ExperienceSchema = z.object({
  positionTitle: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  company: z.string(),
  contributions: z.array(z.string()),
});

export const EducationSchema = z.object({
  university: z.string(),
  degree: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const ReferenceSchema = z.object({
  name: z.string(),
  position: z.string(),
  number: z.string(),
  email: z.string().email(),
});

export const ResumeSchema = z.object({
  fullName: z.string(),
  country: z.string(),
  city: z.string(),
  address: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  positionName: z.string(),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(z.string()),
  references: z.array(ReferenceSchema),
});

export type TResume = z.infer<typeof ResumeSchema>;
