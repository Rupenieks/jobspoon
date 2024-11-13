import { z } from 'zod';
import { MatchBaseSchema } from '../match/TMatch';

export const JobMatchRunBaseSchema = z.object({
	id: z.string(),
	userId: z.string(),
	resumeId: z.string(),
	createdAt: z.date().transform((date) => date.toISOString()),
});

export const JobMatchRunWithMatchesSchema = JobMatchRunBaseSchema.extend({
	matches: z.array(MatchBaseSchema),
});

export type TJobMatchRunBase = z.infer<typeof JobMatchRunBaseSchema>;
export type TJobMatchRunWithMatches = z.infer<typeof JobMatchRunWithMatchesSchema>;
