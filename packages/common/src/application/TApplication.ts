import { z } from "zod";
import { MatchSchema, ResumeSchema } from "..";

export const ApplicationSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  resumeId: z.string(),
  resume: ResumeSchema,
  matchId: z.string(),
  match: MatchSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TApplication = z.infer<typeof ApplicationSchema>;
