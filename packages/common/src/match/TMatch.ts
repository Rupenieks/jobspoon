import { z } from "zod";
import { ApplicationSchema } from "../application";

export const MatchSchema = z.object({
  id: z.string(),
  resumeId: z.string(),
  integrationId: z.string(),
  companyName: z.string().optional(),
  companyUrl: z.string().optional(),
  seniority: z.string().optional(),
  positionTitle: z.string(),
  description: z.string().optional(),
  longDescription: z.string().optional(),
  country: z.string(),
  city: z.string(),
  applyUrl: z.string().optional(),
  domain: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  provider: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  application: ApplicationSchema.nullish(),
});

export type TMatch = z.infer<typeof MatchSchema>;
