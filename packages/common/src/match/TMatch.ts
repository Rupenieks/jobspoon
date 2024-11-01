import { z } from "zod";
import { ApplicationBaseSchema } from "../application";

// Base Match Schema (no relations)
export const MatchBaseSchema = z.object({
  id: z.string(),
  resumeId: z.string(),
  integrationId: z.string(),
  companyName: z.string().nullish(),
  companyUrl: z.string().nullish(),
  seniority: z.string().nullish(),
  positionTitle: z.string(),
  description: z.string().nullish(),
  longDescription: z.string().nullish(),
  country: z.string(),
  city: z.string(),
  applyUrl: z.string().nullish(),
  domain: z.string().nullish(),
  longitude: z.number().nullish(),
  latitude: z.number().nullish(),
  provider: z.string(),
  createdAt: z.date().transform((date) => date.toISOString()),
  updatedAt: z.date().transform((date) => date.toISOString()),
});

// Match with Application
export const MatchWithApplicationSchema = MatchBaseSchema.extend({
  application: ApplicationBaseSchema.nullish(),
});

export type TMatchBase = z.infer<typeof MatchBaseSchema>;
export type TMatchWithApplication = z.infer<typeof MatchWithApplicationSchema>;
