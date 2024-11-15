import { z } from 'zod';
import { ApplicationStages } from './TApplication';

export const WeeklyApplicationsSchema = z.object({
	week: z.string(),
	applications: z.number(),
});

export const ApplicationStageSchema = z.object({
	name: z.enum(ApplicationStages),
	value: z.number(),
});

export const DashboardAnalyticsSchema = z.object({
	applicationStages: z.array(ApplicationStageSchema),
	weeklyApplications: z.array(WeeklyApplicationsSchema),
});

export type WeeklyApplications = z.infer<typeof WeeklyApplicationsSchema>;
export type ApplicationStage = z.infer<typeof ApplicationStageSchema>;
export type ApplicationAnalytics = z.infer<typeof DashboardAnalyticsSchema>;
