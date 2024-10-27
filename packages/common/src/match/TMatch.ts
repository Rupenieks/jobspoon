import { z } from "zod";

export const MatchSchema = z.object({
  id: z.string(),
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
  provider: z.string(),
  resumeId: z.string(),
});

export type TMatch = z.infer<typeof MatchSchema>;
