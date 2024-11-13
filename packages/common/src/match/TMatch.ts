import { z } from 'zod';
import { JobMatchRunBaseSchema } from '../jobMatchRun/TJobMatchRun';
import { ApplicationBaseSchema } from '../application/TApplication';

// Company Schema
export const CompanySchema = z.object({
	name: z.string().nullish(),
	domain: z.string().nullish(),
	industry: z.string().nullish(),
	country: z.string().nullish(),
	countryCode: z.string().nullish(),
	employeeCount: z.number().nullish(),
	logo: z.string().nullish(),
	url: z.string().nullish(),
	linkedinUrl: z.string().nullish(),
	foundedYear: z.number().nullish(),
	annualRevenue: z.number().nullish(),
	totalFunding: z.number().nullish(),
	employeeCountRange: z.string().nullish(),
	description: z.string().nullish(),
	city: z.string().nullish(),
	technologies: z.array(z.string()).nullish(),
});

// Hiring Team Member Schema
export const HiringTeamMemberSchema = z.object({
	firstName: z.string().nullish(),
	fullName: z.string().nullish(),
	linkedinUrl: z.string().nullish(),
	role: z.string().nullish(),
	imageUrl: z.string().nullish(),
});

// Base Match Schema (no relations)
export const MatchBaseSchema = z.object({
	id: z.string(),
	resumeId: z.string(),
	integrationId: z.string(),
	companyName: z.string().nullable(),
	companyUrl: z.string().nullable(),
	seniority: z.string().nullable(),
	positionTitle: z.string(),
	description: z.string().nullable(),
	longDescription: z.string().nullable(),
	country: z.string(),
	city: z.string(),
	applyUrl: z.string().nullable(),
	domain: z.string().nullable(),
	longitude: z.number().nullable(),
	latitude: z.number().nullable(),
	provider: z.string(),
	datePosted: z.string().nullable(),
	hybrid: z.boolean().nullable(),
	remote: z.boolean().nullable(),
	salary: z.string().nullable(),
	reposted: z.boolean().nullable(),
	dateReposted: z.string().nullable(),
	hiringTeam: z.any().nullable(),
	company: z.any().nullable(),
	jobMatchRunId: z.string().nullable(),
	createdAt: z.date().transform((date) => date.toISOString()),
	updatedAt: z.date().transform((date) => date.toISOString()),
});

// Match with Application
export const MatchWithApplicationSchema = MatchBaseSchema.extend({
	application: ApplicationBaseSchema.nullish(),
});

// Match with Job Match Run
export const MatchWithJobMatchRunSchema = MatchBaseSchema.extend({
	jobMatchRun: JobMatchRunBaseSchema.nullable(),
});

export type TMatchBase = z.infer<typeof MatchBaseSchema>;
export type TMatchWithApplication = z.infer<typeof MatchWithApplicationSchema>;
export type TMatchWithJobMatchRun = z.infer<typeof MatchWithJobMatchRunSchema>;
