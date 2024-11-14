import React, { useEffect, useState } from 'react';
import type { TResumeData } from '@redundant/common/src';
import { getResumeTemplate } from '../templates';
import WebFont from 'webfontloader';

const PDFPreview: React.FC = () => {
	const [resume, setResume] = useState<TResumeData | null>(null);

	useEffect(() => {
		const resumeData = localStorage.getItem('resume');
		if (resumeData) {
			const parsedResume = JSON.parse(resumeData);
			setResume(parsedResume);
		}
	}, []);

	useEffect(() => {
		if (resume?.config?.font) {
			WebFont.load({
				google: {
					families: [resume.config.font],
				},
			});
		}
	}, [resume?.config?.font]);

	if (!resume) return null;

	const ResumeTemplate = getResumeTemplate(resume.config.template || 'standard');

	return (
		<div className="flex flex-col gap-8">
			{resume.pages.map((_, pageIndex) => (
				<div key={pageIndex} className="preview bg-white w-[210mm] min-h-[297mm] mx-auto h-fit">
					<ResumeTemplate resume={resume} pageIndex={pageIndex} />
				</div>
			))}
		</div>
	);
};

export default PDFPreview;
