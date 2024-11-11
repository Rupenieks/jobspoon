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
import { Skeleton } from '../ui/skeleton';
import InterviewStage from './InterviewStage';

const stages = ['not_applied', 'applied', 'interview', 'success'] as const;

const LoadingSkeleton = () => (
	<div className="container mx-auto p-4 space-y-6">
		<Skeleton className="h-10 w-40" /> {/* Back button */}
		<div className="max-w-3xl mx-auto">
			<div className="flex justify-between mb-8">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="flex flex-col items-center gap-2">
						<Skeleton className="h-10 w-10 rounded-full" />
						<Skeleton className="h-4 w-16" />
					</div>
				))}
			</div>
			<Skeleton className="h-1 w-full" /> {/* Progress bar */}
		</div>
		<div className="space-y-4">
			<Skeleton className="h-[400px] w-full" /> {/* Main content area */}
		</div>
	</div>
);

const ApplicationPage: React.FC = () => {
	const { applicationId } = useParams<{ applicationId: string }>();
	const navigate = useNavigate();
	const { data: application, isLoading } = useReadApplication(applicationId);
	const [activeStage, setActiveStage] = useState<
		'not_applied' | 'applied' | 'interview' | 'success' | 'rejected'
	>();
	const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

	// Only set active stage once application is loaded
	React.useEffect(() => {
		if (application) {
			setActiveStage(application.stage);
		}
	}, [application]);

	const handleGoBack = () => {
		navigate('/applications');
	};

	const handleStageChange = (
		newStage: 'not_applied' | 'applied' | 'interview' | 'success' | 'rejected'
	) => {
		if (!application) return;

		const currentIndex = stages.indexOf(activeStage as any);
		const newIndex = stages.indexOf(newStage);
		setDirection(newIndex > currentIndex ? 1 : -1);
		setActiveStage(newStage);
	};

	const currentView = useMemo(() => {
		if (!application || !activeStage) return null;

		switch (activeStage) {
			case 'not_applied':
				return <ApplicationDetails onChangeStage={handleStageChange} />;
			case 'applied':
				return <AppliedStage onStageChange={handleStageChange} />;
			case 'interview':
				return <InterviewStage />;
			case 'success':
				return <div>Success</div>;
			case 'rejected':
				return <RejectedStage />;
		}
	}, [activeStage, application]);

	if (isLoading || !application || !activeStage) {
		return <LoadingSkeleton />;
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
