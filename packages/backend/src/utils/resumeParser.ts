import { TApplication, TMatch, TResume } from '@redundant/common';

export function parseResumeFields(
  resume: TResume & { matches?: TMatch[]; application?: TApplication },
): TResume {
  return {
    ...resume,
    experience: Array.isArray(resume.experience)
      ? resume.experience
      : JSON.parse(resume.experience as unknown as string),
    education: Array.isArray(resume.education)
      ? resume.education
      : JSON.parse(resume.education as unknown as string),
  };
}
