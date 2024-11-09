import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReadApplication } from '@/hooks/useReadApplication';
import { useUpdateApplicationStage } from '@/hooks/useUpdateApplicationStage';
import ApplicationStepper from './ApplicationStepper';

const ApplicationPage: React.FC = () => {
	const { applicationId } = useParams<{ applicationId: string }>();
	const navigate = useNavigate();
	const { data: application, isLoading } = useReadApplication(applicationId);
	const { mutate: updateStage } = useUpdateApplicationStage();

	const handleGoBack = () => {
		navigate('/applications');
	};

	const handleStageChange = (newStage: 'not_applied' | 'applied' | 'interview' | 'success') => {
		if (applicationId) {
			updateStage({ applicationId, stage: newStage });
		}
	};

	if (isLoading || !application) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto p-4 space-y-6">
			<Button variant="ghost" onClick={handleGoBack}>
				<ChevronLeft className="mr-2 h-4 w-4" /> Back to Applications
			</Button>

			<div className="max-w-3xl mx-auto">
				<ApplicationStepper currentStage={application.stage} onStageChange={handleStageChange} />
			</div>
		</div>
	);
};

export default ApplicationPage;
