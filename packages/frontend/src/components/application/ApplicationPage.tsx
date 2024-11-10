import { Button } from '@/components/ui/button';
import { useReadApplication } from '@/hooks/useReadApplication';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationDetails from './ApplicationDetails';
import ApplicationStepper from './ApplicationStepper';
import AppliedStage from './AppliedStage';
import RejectedStage from './RejectedStage';

const stages = ['not_applied', 'applied', 'interview', 'success'] as const;

const ApplicationPage: React.FC = () => {
	const { applicationId } = useParams<{ applicationId: string }>();
	const navigate = useNavigate();
	const { data: application, isLoading } = useReadApplication(applicationId);
	const [activeStage, setActiveStage] = useState<
		'not_applied' | 'applied' | 'interview' | 'success' | 'rejected'
	>(application?.stage || 'not_applied');
	const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

	const handleGoBack = () => {
		navigate('/applications');
	};

	const handleStageChange = (
		newStage: 'not_applied' | 'applied' | 'interview' | 'success' | 'rejected'
	) => {
		const currentIndex = stages.indexOf(activeStage as any);
		const newIndex = stages.indexOf(newStage);
		setDirection(newIndex > currentIndex ? 1 : -1);
		setActiveStage(newStage);
	};

	const currentView = useMemo(() => {
		switch (activeStage) {
			case 'not_applied':
				return <ApplicationDetails onChangeStage={handleStageChange} />;
			case 'applied':
				return <AppliedStage />;
			case 'interview':
				return <div>Interview</div>;
			case 'success':
				return <div>Success</div>;
			case 'rejected':
				return <RejectedStage />;
		}
	}, [activeStage]);

	if (isLoading || !application) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto p-4 space-y-6">
			<Button variant="ghost" onClick={handleGoBack}>
				<ChevronLeft className="mr-2 h-4 w-4" /> Back to Applications
			</Button>

			<div className="max-w-3xl mx-auto">
				<ApplicationStepper
					currentStage={activeStage}
					applicationStage={application.stage}
					onStageChange={handleStageChange}
				/>
			</div>

			<AnimatePresence mode="wait">
				<motion.div
					key={activeStage}
					initial={{ x: -300 * direction, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: 300 * direction, opacity: 0 }}
					transition={{ type: 'spring', stiffness: 300, damping: 30 }}
				>
					{currentView}
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default ApplicationPage;
