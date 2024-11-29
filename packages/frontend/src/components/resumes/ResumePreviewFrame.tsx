import { useRef } from 'react';
import { useResumeState } from './ResumeStateContext';
import { getEnvConfig } from '@/utils/config';
import useResumeStateSender from '@/hooks/useResumeStateSender';

const ResumePreviewFrame = () => {
	const { resume, temporaryResume } = useResumeState();
	const iframeRef = useRef<HTMLIFrameElement>(null);

	const previewUrl =
		import.meta.env.NODE_ENV === 'development'
			? 'http://localhost:3001/creator'
			: `${getEnvConfig().previewUrl}/creator`;

	useResumeStateSender({ resume: temporaryResume?.data || resume?.data || null, iframeRef });

	return (
		<div className="relative w-full h-full border border-gray-200 rounded-md">
			<iframe
				ref={iframeRef}
				title="Resume Preview"
				src={previewUrl}
				className="w-full h-full border border-gray-200 rounded-md"
			/>
		</div>
	);
};

export default ResumePreviewFrame;
