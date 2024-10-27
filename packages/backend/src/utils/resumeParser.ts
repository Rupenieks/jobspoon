import { TApplication, TMatch, TResume } from '@redundant/common';

export function parseResumeFields(
  resume: TResume & { matches?: TMatch[]; application?: TApplication },
): TResume {
  return {
    ...resume,
    experience:
      typeof resume.experience === 'string'
        ? parseJsonField(resume.experience)
        : Array.isArray(resume.experience)
          ? resume.experience
          : [],
    education:
      typeof resume.education === 'string'
        ? parseJsonField(resume.education)
        : Array.isArray(resume.education)
          ? resume.education
          : [],
    references:
      typeof resume.references === 'string'
        ? parseJsonField(resume.references)
        : Array.isArray(resume.references)
          ? resume.references
          : [],
  };
}

function parseJsonField(field: string): any[] {
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error parsing JSON field:', error);
    return [];
  }
}
