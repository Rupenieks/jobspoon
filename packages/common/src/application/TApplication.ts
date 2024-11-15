import { z } from 'zod';
import { MatchBaseSchema } from '../match';
import { ResumeBaseSchema } from '../resume';

export const ApplicationStages = [
	'not_applied',
	'applied',
	'interview',
	'rejected',
	'success',
] as const;

// Base Application Schema (no relations)
export const ApplicationBaseSchema = z.object({
	id: z.string(),
	resumeId: z.string(),
	matchId: z.string(),
	stage: z.enum(ApplicationStages).default('not_applied'),
	createdAt: z.date().transform((date) => date.toISOString()),
	updatedAt: z.date().transform((date) => date.toISOString()),
	userId: z.string(),
});

// Application with Resume
export const ApplicationWithResumeSchema = ApplicationBaseSchema.extend({
	resume: ResumeBaseSchema,
});

// Application with Match
export const ApplicationWithMatchSchema = ApplicationBaseSchema.extend({
	match: MatchBaseSchema,
});

export type TApplicationBase = z.infer<typeof ApplicationBaseSchema>;
export type TApplicationWithResume = z.infer<typeof ApplicationWithResumeSchema>;
export type TApplicationWithMatch = z.infer<typeof ApplicationWithMatchSchema>;
