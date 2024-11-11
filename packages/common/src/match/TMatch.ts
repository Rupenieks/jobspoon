import { z } from 'zod';
import { ApplicationBaseSchema } from '../application';

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
	companyName: z.string().nullish(),
	companyUrl: z.string().nullish(),
	seniority: z.string().nullish(),
	positionTitle: z.string(),
	description: z.string().nullish(),
	longDescription: z.string().nullish(),
	country: z.string(),
	city: z.string(),
	applyUrl: z.string().nullish(),
	domain: z.string().nullish(),
	longitude: z.number().nullish(),
	latitude: z.number().nullish(),
	provider: z.string(),
	createdAt: z.date().transform((date) => date.toISOString()),
	updatedAt: z.date().transform((date) => date.toISOString()),
	datePosted: z.string().nullish(),
	hybrid: z.boolean().nullish(),
	remote: z.boolean().nullish(),
	salary: z.string().nullish(),
	reposted: z.boolean().nullish(),
	dateReposted: z.string().nullish(),
	hiringTeam: z.array(HiringTeamMemberSchema).nullish(),
	company: CompanySchema.nullish(),
	userId: z.string(),
});

// Match with Application
export const MatchWithApplicationSchema = MatchBaseSchema.extend({
	application: ApplicationBaseSchema.nullish(),
});

export type TMatchBase = z.infer<typeof MatchBaseSchema>;
export type TMatchWithApplication = z.infer<typeof MatchWithApplicationSchema>;
