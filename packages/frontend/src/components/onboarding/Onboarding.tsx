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

const fadeVariants = {
	initial: {
		opacity: 0,
		scale: 0.98,
	},
	animate: {
		opacity: 1,
		scale: 1,
	},
	exit: {
		opacity: 0,
		scale: 0.98,
	},
};

const Onboarding = () => {
	const [currentStep, setCurrentStep] = useState(1);
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
		setCurrentStep(2);
	};

	const handleJobTitlesSubmit = async (
		data: Pick<OnboardingData, 'desiredJobTitles' | 'seekingRemote'>
	) => {
		setFormData((prev) => ({ ...prev, ...data }));
		setCurrentStep(3);
		await onboardUser({
			...formData,
			...data,
		});
		await onboardingCreate();
	};

	const handleBack = () => {
		setCurrentStep(1);
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

				<AnimatePresence mode="wait">
					<motion.div
						key={currentStep}
						variants={fadeVariants}
						initial="initial"
						animate="animate"
						exit="exit"
						transition={{
							duration: 0.3,
							ease: 'easeInOut',
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
