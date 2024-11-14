import { z } from 'zod';
import { MatchBaseSchema } from '../match';
import { ApplicationBaseSchema } from '../application';
import { JobMatchRunBaseSchema } from '../jobMatchRun/TJobMatchRun';

// Base schemas for resume data
export const ExperienceSchema = z.object({
	positionTitle: z.string().nullish(),
	startDate: z.string().nullish(),
	endDate: z.string().nullish(),
	company: z.string().nullish(),
	contributions: z.array(z.string()).nullish(),
});

export const EducationSchema = z.object({
	university: z.string().nullish(),
	degree: z.string().nullish(),
	startDate: z.string().nullish(),
	endDate: z.string().nullish(),
});

export const ReferenceSchema = z.object({
	name: z.string().nullish(),
	position: z.string().nullish(),
	number: z.string().nullish(),
	email: z.string().nullish(),
});

export const ResumeConfigSchema = z.object({
	primaryColor: z.string().default('#1f2937'),
	fontSize: z.number().default(16),
	font: z.string().default('Roboto'),
	margin: z.number().default(10),
	fontColor: z.string().default('#ffffff'),
	backgroundColor: z.string().default('#ffffff'),
	sidebarColor: z.string().default('#f9fafb'),
	sidebarFontColor: z.string().default('#ffffff'),
	template: z.string().default('standard'),
});

// Define section types
export const SectionTypeEnum = z.enum(['personalInfo', 'experience', 'education', 'skills']);

export type TSectionType = z.infer<typeof SectionTypeEnum>;

// Define a section schema (removed order field)
export const SectionSchema = z.object({
	id: z.string(),
	type: SectionTypeEnum,
	title: z.string(),
});

// Define a page schema
export const PageSchema = z.object({
	sections: z.array(SectionSchema),
});

// First, let's define the template types
export const ResumeTemplateEnum = z.enum(['standard', 'modern', 'fineprint', 'Hipster']);
export type TResumeTemplate = z.infer<typeof ResumeTemplateEnum>;

// This is the pure resume data schema (what's in the data field)
export const ResumeDataSchema = z.object({
	// Section data
	personalInfo: z.object({
		fullName: z.string().nullish(),
		summary: z.string().nullish(),
		country: z.string().nullish(),
		city: z.string().nullish(),
		address: z.string().nullish(),
		email: z.string().nullish(),
		phoneNumber: z.string().nullish(),
		positionName: z.string().nullish(),
		profileBio: z.string().default(''),
	}),
	experience: z.array(ExperienceSchema).nullish(),
	education: z.array(EducationSchema).nullish(),
	skills: z.array(z.string()).nullish(),

	pages: z.array(PageSchema).default([
		{
			sections: [
				{ id: 'personal-info', type: 'personalInfo', title: 'Personal Information' },
				{ id: 'experience', type: 'experience', title: 'Experience' },
				{ id: 'education', type: 'education', title: 'Education' },
				{ id: 'skills', type: 'skills', title: 'Skills' },
			],
		},
	]),

	config: ResumeConfigSchema.default({
		primaryColor: '#ffffff',
		fontSize: 16,
		font: 'Roboto',
		margin: 10,
		fontColor: '#000000',
		sidebarFontColor: '#ffffff',
		backgroundColor: '#ffffff',
		sidebarColor: '#000080',
		template: 'standard',
	}),
	previewImage: z.string().nullish(),
	profileImage: z.string().nullish(),
});

// Base Resume Model (no relations)
export const ResumeBaseSchema = z.object({
	id: z.string(),
	userId: z.string(),
	data: ResumeDataSchema,
	matchId: z.string().nullish(),
	applicationId: z.string().nullish(),
	createdAt: z.date().transform((date) => date.toISOString()),
	updatedAt: z.date().transform((date) => date.toISOString()),
	canRunJobsMatch: z.boolean().optional(),
});

// Resume with Match IDs
export const ResumeWithMatchIdsSchema = ResumeBaseSchema.extend({
	matches: z.array(
		z.object({
			id: z.string(),
			application: z.object({ id: z.string() }).nullable(),
		})
	),
	canRunJobsMatch: z.boolean().optional(),
});

// Resume with Matches
export const ResumeWithMatchesSchema = ResumeBaseSchema.extend({
	matches: z.array(MatchBaseSchema),
	canRunJobsMatch: z.boolean().optional(),
});

// Resume with Application
export const ResumeWithApplicationSchema = ResumeBaseSchema.extend({
	application: ApplicationBaseSchema,
	canRunJobsMatch: z.boolean().optional(),
});

// Full Resume Model (all relations)
export const ResumeFullSchema = ResumeBaseSchema.extend({
	matches: z.array(MatchBaseSchema).nullish(),
	application: ApplicationBaseSchema.nullish(),
	jobMatchRuns: z.array(JobMatchRunBaseSchema).nullish(),
	canRunJobsMatch: z.boolean().optional(),
});

// Types
export type TResumeData = z.infer<typeof ResumeDataSchema>;
export type TResumeBase = z.infer<typeof ResumeBaseSchema>;
export type TResumeWithMatchIds = z.infer<typeof ResumeWithMatchIdsSchema>;
export type TResumeWithMatches = z.infer<typeof ResumeWithMatchesSchema>;
export type TResumeWithApplication = z.infer<typeof ResumeWithApplicationSchema>;
export type TResumeFull = z.infer<typeof ResumeFullSchema>;

// DTOs
export const ResumeCreateDTOSchema = ResumeDataSchema;
export const ResumeUpdateDTOSchema = ResumeDataSchema.partial();

export type TResumeCreateDTO = z.infer<typeof ResumeCreateDTOSchema>;
export type TResumeUpdateDTO = z.infer<typeof ResumeUpdateDTOSchema>;

// Add this type export
export type TResumeConfig = z.infer<typeof ResumeConfigSchema>;

export const ResumesWithRunsRemainingSchema = z.object({
	jobRunsRemaining: z.number(),
	resumes: z.array(ResumeFullSchema),
});

export type TResumesWithRunsRemaining = z.infer<typeof ResumesWithRunsRemainingSchema>;
