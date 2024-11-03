import { z } from "zod";
import { MatchBaseSchema } from "../match";
import { ApplicationBaseSchema } from "../application";

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

// Add this before ResumeDataSchema
export const ResumeConfigSchema = z.object({
  primaryColor: z.string().default("#1f2937"), // Default to the current navy color
  fontSize: z.number().default(16),
  font: z.string().default("Roboto"),
  margin: z.number().default(10), // 25.4mm is 1 inch, standard margin
  pages: z.number().min(1).default(1), // Default to 1 page
});

// This is the pure resume data schema (what's in the data field)
export const ResumeDataSchema = z.object({
  fullName: z.string().nullish(),
  summary: z.string().nullish(),
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
  config: ResumeConfigSchema.default({
    primaryColor: "#1f2937",
    fontSize: 16,
    font: "Roboto",
    margin: 10,
    pages: 1,
  }),
});

// Base Resume Model (no relations)
export const ResumeBaseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  data: ResumeDataSchema,
  createdAt: z.date().transform((date) => date.toISOString()),
  updatedAt: z.date().transform((date) => date.toISOString()),
});

// Resume with Match IDs
export const ResumeWithMatchIdsSchema = ResumeBaseSchema.extend({
  matches: z.array(
    z.object({
      id: z.string(),
      application: z.object({ id: z.string() }).nullable(),
    })
  ),
});

// Resume with Matches
export const ResumeWithMatchesSchema = ResumeBaseSchema.extend({
  matches: z.array(MatchBaseSchema),
});

// Resume with Application
export const ResumeWithApplicationSchema = ResumeBaseSchema.extend({
  application: ApplicationBaseSchema,
});

// Full Resume Model (all relations)
export const ResumeFullSchema = ResumeBaseSchema.extend({
  matches: z.array(MatchBaseSchema).nullish(),
  application: ApplicationBaseSchema.nullish(),
});

// Types
export type TResumeData = z.infer<typeof ResumeDataSchema>;
export type TResumeBase = z.infer<typeof ResumeBaseSchema>;
export type TResumeWithMatchIds = z.infer<typeof ResumeWithMatchIdsSchema>;
export type TResumeWithMatches = z.infer<typeof ResumeWithMatchesSchema>;
export type TResumeWithApplication = z.infer<
  typeof ResumeWithApplicationSchema
>;
export type TResumeFull = z.infer<typeof ResumeFullSchema>;

// DTOs
export const ResumeCreateDTOSchema = ResumeDataSchema;
export const ResumeUpdateDTOSchema = ResumeDataSchema.partial();

export type TResumeCreateDTO = z.infer<typeof ResumeCreateDTOSchema>;
export type TResumeUpdateDTO = z.infer<typeof ResumeUpdateDTOSchema>;

// Add this type export
export type TResumeConfig = z.infer<typeof ResumeConfigSchema>;
