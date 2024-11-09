import { z } from 'zod';

export const InsightGenerationRequestSchema = z.object({
	id: z.string(),
	applicationId: z.string(),
	applicationStage: z.enum(['not_applied', 'applied', 'interview', 'rejected', 'success']),
	status: z.enum(['STARTED', 'SUCCESS', 'ERROR']),
	generatedInsightId: z.string().nullable(),
	createdAt: z.date().transform((date) => date.toISOString()),
	updatedAt: z.date().transform((date) => date.toISOString()),
});

export type TInsightGenerationRequest = z.infer<typeof InsightGenerationRequestSchema>;

export const InsightGenerationRequestCreateDTOSchema = z.object({
	applicationId: z.string(),
	applicationStage: z.enum(['not_applied', 'applied', 'interview', 'rejected', 'success']),
});

export type TInsightGenerationRequestCreateDTO = z.infer<
	typeof InsightGenerationRequestCreateDTOSchema
>;
