import { z } from 'zod';
import { ResumeDataSchema } from '../resume';
import { ApplicationBaseSchema } from '../application';

export const InsightDataSchema = z.object({
	title: z.string(),
	description: z.string(),
	resumeChangeData: ResumeDataSchema.partial().nullish(),
});

export const InsightBaseSchema = z.object({
	id: z.string(),
	applicationId: z.string(),
	stage: z.enum(['not_applied', 'applied', 'interview', 'rejected', 'success']),
	data: InsightDataSchema,
	createdAt: z.date().transform((date) => date.toISOString()),
	updatedAt: z.date().transform((date) => date.toISOString()),
});

export const InsightWithApplicationSchema = InsightBaseSchema.extend({
	application: z.lazy(() => ApplicationBaseSchema),
});

export type TInsightData = z.infer<typeof InsightDataSchema>;
export type TInsightBase = z.infer<typeof InsightBaseSchema>;
export type TInsightWithApplication = z.infer<typeof InsightWithApplicationSchema>;

// DTOs
export const InsightCreateDTOSchema = z.object({
	applicationId: z.string(),
	stage: z.enum(['not_applied', 'applied', 'interview', 'rejected', 'success']),
	data: InsightDataSchema,
});

export type TInsightCreateDTO = z.infer<typeof InsightCreateDTOSchema>;
