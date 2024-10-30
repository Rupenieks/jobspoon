import { z } from "zod";
import { MatchSchema, ResumeModelSchema } from "..";

export const ApplicationSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    jobId: z.string(),
    resumeId: z.string(),
    resume: ResumeModelSchema,
    matchId: z.string(),
    match: MatchSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
  })
);

export type TApplication = z.infer<typeof ApplicationSchema>;
