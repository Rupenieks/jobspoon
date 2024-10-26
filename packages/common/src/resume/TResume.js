"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeSchema = exports.ReferenceSchema = exports.EducationSchema = exports.ExperienceSchema = void 0;
const zod_1 = require("zod");
exports.ExperienceSchema = zod_1.z.object({
    positionTitle: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    company: zod_1.z.string().optional(),
    contributions: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.EducationSchema = zod_1.z.object({
    university: zod_1.z.string().optional(),
    degree: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
exports.ReferenceSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    position: zod_1.z.string().optional(),
    number: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
});
exports.ResumeSchema = zod_1.z
    .object({
    fullName: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string().optional(),
    positionName: zod_1.z.string().optional(),
    experience: zod_1.z.array(exports.ExperienceSchema).optional(),
    education: zod_1.z.array(exports.EducationSchema).optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    references: zod_1.z.array(exports.ReferenceSchema).optional(),
})
    .passthrough();
//# sourceMappingURL=TResume.js.map