import { z } from "zod";
export declare const ExperienceSchema: z.ZodObject<{
    positionTitle: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodString>;
    contributions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    positionTitle?: string;
    startDate?: string;
    endDate?: string;
    company?: string;
    contributions?: string[];
}, {
    positionTitle?: string;
    startDate?: string;
    endDate?: string;
    company?: string;
    contributions?: string[];
}>;
export declare const EducationSchema: z.ZodObject<{
    university: z.ZodOptional<z.ZodString>;
    degree: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    startDate?: string;
    endDate?: string;
    university?: string;
    degree?: string;
}, {
    startDate?: string;
    endDate?: string;
    university?: string;
    degree?: string;
}>;
export declare const ReferenceSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodString>;
    number: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    number?: string;
    name?: string;
    position?: string;
    email?: string;
}, {
    number?: string;
    name?: string;
    position?: string;
    email?: string;
}>;
export declare const ResumeSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    positionName: z.ZodOptional<z.ZodString>;
    experience: z.ZodOptional<z.ZodArray<z.ZodObject<{
        positionTitle: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        company: z.ZodOptional<z.ZodString>;
        contributions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        positionTitle?: string;
        startDate?: string;
        endDate?: string;
        company?: string;
        contributions?: string[];
    }, {
        positionTitle?: string;
        startDate?: string;
        endDate?: string;
        company?: string;
        contributions?: string[];
    }>, "many">>;
    education: z.ZodOptional<z.ZodArray<z.ZodObject<{
        university: z.ZodOptional<z.ZodString>;
        degree: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        startDate?: string;
        endDate?: string;
        university?: string;
        degree?: string;
    }, {
        startDate?: string;
        endDate?: string;
        university?: string;
        degree?: string;
    }>, "many">>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    references: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        position: z.ZodOptional<z.ZodString>;
        number: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        number?: string;
        name?: string;
        position?: string;
        email?: string;
    }, {
        number?: string;
        name?: string;
        position?: string;
        email?: string;
    }>, "many">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    fullName: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    positionName: z.ZodOptional<z.ZodString>;
    experience: z.ZodOptional<z.ZodArray<z.ZodObject<{
        positionTitle: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        company: z.ZodOptional<z.ZodString>;
        contributions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        positionTitle?: string;
        startDate?: string;
        endDate?: string;
        company?: string;
        contributions?: string[];
    }, {
        positionTitle?: string;
        startDate?: string;
        endDate?: string;
        company?: string;
        contributions?: string[];
    }>, "many">>;
    education: z.ZodOptional<z.ZodArray<z.ZodObject<{
        university: z.ZodOptional<z.ZodString>;
        degree: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        startDate?: string;
        endDate?: string;
        university?: string;
        degree?: string;
    }, {
        startDate?: string;
        endDate?: string;
        university?: string;
        degree?: string;
    }>, "many">>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    references: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        position: z.ZodOptional<z.ZodString>;
        number: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        number?: string;
        name?: string;
        position?: string;
        email?: string;
    }, {
        number?: string;
        name?: string;
        position?: string;
        email?: string;
    }>, "many">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    fullName: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    positionName: z.ZodOptional<z.ZodString>;
    experience: z.ZodOptional<z.ZodArray<z.ZodObject<{
        positionTitle: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        company: z.ZodOptional<z.ZodString>;
        contributions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        positionTitle?: string;
        startDate?: string;
        endDate?: string;
        company?: string;
        contributions?: string[];
    }, {
        positionTitle?: string;
        startDate?: string;
        endDate?: string;
        company?: string;
        contributions?: string[];
    }>, "many">>;
    education: z.ZodOptional<z.ZodArray<z.ZodObject<{
        university: z.ZodOptional<z.ZodString>;
        degree: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        startDate?: string;
        endDate?: string;
        university?: string;
        degree?: string;
    }, {
        startDate?: string;
        endDate?: string;
        university?: string;
        degree?: string;
    }>, "many">>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    references: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        position: z.ZodOptional<z.ZodString>;
        number: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        number?: string;
        name?: string;
        position?: string;
        email?: string;
    }, {
        number?: string;
        name?: string;
        position?: string;
        email?: string;
    }>, "many">>;
}, z.ZodTypeAny, "passthrough">>;
export type TResume = z.infer<typeof ResumeSchema>;
