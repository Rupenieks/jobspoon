import { TResumeData } from '@redundant/common/src';
import { StandardTemplate } from './StandardTemplate';
import { ModernTemplate } from './ModernTemplate';
import { FineprintTemplate } from './FineprintTemplate';

export interface ResumeTemplateProps {
	resume: TResumeData;
	pageIndex: number;
}

export const RESUME_TEMPLATES: Record<string, React.FC<ResumeTemplateProps>> = {
	standard: StandardTemplate,
	modern: ModernTemplate,
	fineprint: FineprintTemplate,
};

export const getResumeTemplate = (templateName: string) => {
	return RESUME_TEMPLATES[templateName] || StandardTemplate;
};
