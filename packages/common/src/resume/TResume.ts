import { z } from "zod";
import { MatchSchema } from "../match";
import { ApplicationSchema } from "../application";

// Base schemas for resume data
export const ExperienceSchema = z.object({
  positionTitle: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  company: z.string().nullish(),
  contributions: z.array(z.string()).nullish(),
});

export const EducationSchema = z.object({
  university: z.string().nullish(),
  degree: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
});

export const ReferenceSchema = z.object({
  name: z.string().nullish(),
  position: z.string().nullish(),
  number: z.string().nullish(),
  email: z.string().nullish(),
});

// This is the pure resume data schema (what's in the data field)
export const ResumeDataSchema = z.object({
  fullName: z.string().nullish(),
  country: z.string().nullish(),
  city: z.string().nullish(),
  address: z.string().nullish(),
  email: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  positionName: z.string().nullish(),
  experience: z.array(ExperienceSchema).nullish(),
  education: z.array(EducationSchema).nullish(),
  skills: z.array(z.string()).nullish(),
  references: z.array(ReferenceSchema).nullish(),
  previewImage: z.string().nullish(),
  profileImage: z.string().nullish(),
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
  createdAt: z.date().transform((date) => date.toISOString()),
  updatedAt: z.date().transform((date) => date.toISOString()),
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
