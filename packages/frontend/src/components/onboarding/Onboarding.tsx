import useCreateResumesForOnboarding from '@/hooks/useCreateResumesForOnboarding';
import { useOnboardUser } from '@/hooks/useOnboardUser';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { OnboardingStepper } from './OnboardingStepper';
import { JobTitlesStep } from './steps/JobTitlesStep';
import { PersonalInfoStep } from './steps/PersonalInfoStep';

interface OnboardingData {
	fullName: string;
	city: string;
	country: string;
	seekingRemote: boolean;
	desiredJobTitles: string[];
}

const Onboarding = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const [direction, setDirection] = useState(0);
	const [formData, setFormData] = useState<OnboardingData>({
		fullName: '',
		city: '',
		country: '',
		seekingRemote: false,
		desiredJobTitles: [''],
	});
	const { mutateAsync: onboardUser } = useOnboardUser();
	const onboardingCreate = useCreateResumesForOnboarding();
	const handlePersonalInfoSubmit = (
		data: Omit<OnboardingData, 'desiredJobTitles' | 'seekingRemote'>
	) => {
		setFormData((prev) => ({ ...prev, ...data }));
		setDirection(1);
		setCurrentStep(2);
	};

	const handleJobTitlesSubmit = async (
		data: Pick<OnboardingData, 'desiredJobTitles' | 'seekingRemote'>
	) => {
		setFormData((prev) => ({ ...prev, ...data }));
		// Handle final submission here
		await onboardUser({
			...formData,
			...data,
		});
		await onboardingCreate();
	};

	const handleBack = () => {
		setDirection(-1);
		setCurrentStep(1);
	};

	const slideVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 1000 : -1000,
			opacity: 0,
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			x: direction < 0 ? 1000 : -1000,
			opacity: 0,
		}),
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
			className="min-h-screen bg-gradient-to-br from-primary to-secondary"
		>
			<div className="container mx-auto px-4 py-16">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.4 }}
				>
					<OnboardingStepper currentStep={currentStep} />
				</motion.div>

				<AnimatePresence initial={false} custom={direction} mode="wait">
					<motion.div
						key={currentStep}
						custom={direction}
						variants={slideVariants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{
							x: { type: 'spring', stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 },
						}}
					>
						{currentStep === 1 ? (
							<PersonalInfoStep
								initialData={{
									fullName: formData.fullName,
									city: formData.city,
									country: formData.country,
								}}
								onSubmit={handlePersonalInfoSubmit}
							/>
						) : (
							<JobTitlesStep
								initialData={{
									desiredJobTitles: formData.desiredJobTitles,
									isRemoteOk: formData.seekingRemote,
								}}
								onSubmit={handleJobTitlesSubmit}
								onBack={handleBack}
							/>
						)}
					</motion.div>
				</AnimatePresence>
			</div>
		</motion.div>
	);
};

export default Onboarding;
