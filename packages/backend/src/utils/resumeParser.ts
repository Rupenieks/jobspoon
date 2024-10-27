import { TApplication, TMatch, TResume } from '@redundant/common';

export function parseResumeFields(
  resume: TResume & { matches?: TMatch[]; application?: TApplication },
): TResume {
  return {
    ...resume,
    experience: parseJsonField(resume.experience as unknown as string),
    education: parseJsonField(resume.education as unknown as string),
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
