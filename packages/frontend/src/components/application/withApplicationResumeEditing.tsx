import { useReadApplication } from '@/hooks/useReadApplication';
import { useParams } from 'react-router-dom';
import { ResumeStateProvider } from '../resumes/ResumeStateContext';
import ApplicationDetailsLoadingSkeleton from './ApplicationDetailsLoadingSkeleton';

// Problem component? @TODO
const withApplicationResumeEditing = (Component: React.ComponentType<any>) => {
	const { applicationId } = useParams<{ applicationId: string }>();
	const { data: application } = useReadApplication(applicationId);

	if (!application?.resume.id) {
		return <ApplicationDetailsLoadingSkeleton />;
	}

	return (props: any) => {
		return (
			<ResumeStateProvider resumeId={application?.resume.id}>
				<Component {...props} />
			</ResumeStateProvider>
		);
	};
};

export default withApplicationResumeEditing;
