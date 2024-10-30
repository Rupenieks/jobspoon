import { z } from "zod";
import { MatchSchema } from "../match";
import { ApplicationSchema } from "../application";

// Base schemas for resume data
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

// This is the pure resume data schema (what's in the data field)
export const ResumeDataSchema = z.object({
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
  previewImage: z.string().optional(),
  profileImage: z.string().optional(),
});

// Raw database model
export const ResumeRawModelSchema = z.object({
  id: z.string(),
  userId: z.string(),
  data: z.any(),
  createdAt: z.date().transform((date) => date.toISOString()),
  updatedAt: z.date().transform((date) => date.toISOString()),
  matches: z.array(MatchSchema).optional(),
  application: ApplicationSchema.nullish(),
});

// Processed model
export const ResumeModelSchema = z.object({
  id: z.string(),
  userId: z.string(),
  data: ResumeDataSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  matches: z.array(MatchSchema).optional(),
  application: ApplicationSchema.nullish(),
});

// Types
export type TResumeData = z.infer<typeof ResumeDataSchema>;
export type TResumeRawModel = z.infer<typeof ResumeRawModelSchema>;
export type TResumeModel = z.infer<typeof ResumeModelSchema>;

// Serializers
export const serializeResume = (resumeData: Partial<TResumeData>): string => {
  return JSON.stringify(resumeData);
};

export const deserializeResume = (rawModel: any): TResumeModel => {
  return {
    ...rawModel,
    data:
      typeof rawModel.data === "string"
        ? JSON.parse(rawModel.data)
        : rawModel.data,
  };
};

// DTOs
export const ResumeCreateDTOSchema = ResumeDataSchema;
export const ResumeUpdateDTOSchema = ResumeDataSchema.partial();

export type TResumeCreateDTO = z.infer<typeof ResumeCreateDTOSchema>;
export type TResumeUpdateDTO = z.infer<typeof ResumeUpdateDTOSchema>;
