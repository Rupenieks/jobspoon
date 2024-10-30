import { z } from "zod";
import { ApplicationSchema } from "../application";

export const MatchSchema = z.object({
  id: z.string(),
  resumeId: z.string(),
  integrationId: z.string(),
  companyName: z.string().nullish(),
  companyUrl: z.string().nullish(),
  seniority: z.string().nullish(),
  positionTitle: z.string(),
  description: z.string().nullish(),
  longDescription: z.string().nullish(),
  country: z.string().nullish(),
  city: z.string().nullish(),
  applyUrl: z.string().nullish(),
  domain: z.string().nullish(),
  longitude: z.number().nullish(),
  latitude: z.number().nullish(),
  provider: z.string().nullish(),
  createdAt: z.date().transform((date) => date.toISOString()),
  updatedAt: z.date().transform((date) => date.toISOString()),
  application: ApplicationSchema.nullish(),
});

export type TMatch = z.infer<typeof MatchSchema>;
