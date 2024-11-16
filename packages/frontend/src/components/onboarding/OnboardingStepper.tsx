import { Check, User, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
	{ id: 1, label: 'Personal Info', icon: User },
	{ id: 2, label: 'Job Titles', icon: Briefcase },
] as const;

interface OnboardingStepperProps {
	currentStep: number;
}

export const OnboardingStepper = ({ currentStep }: OnboardingStepperProps) => {
	return (
		<div className="w-full max-w-2xl mx-auto mb-12">
			<div className="relative flex justify-between">
				{steps.map((step, index) => {
					const Icon = step.icon;
					const isCompleted = currentStep > step.id;
					const isActive = currentStep === step.id;

					return (
						<div key={step.id} className="relative flex flex-col items-center">
							<div
								className={cn(
									'z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background',
									isActive && 'border-primary bg-primary text-primary-foreground',
									isCompleted && 'border-success bg-success text-success-foreground',
									!isActive && !isCompleted && 'border-muted'
								)}
							>
								{isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
							</div>
							<span
								className={cn(
									'mt-2 text-sm font-medium',
									isActive && 'text-primary',
									isCompleted && 'text-success',
									!isActive && !isCompleted && 'text-muted-foreground'
								)}
							>
								{step.label}
							</span>
						</div>
					);
				})}

				{/* Connecting line */}
				<div
					className="absolute top-5 left-0 right-0 h-[2px] -translate-y-1/2"
					style={{ width: 'calc(100% - 2.5rem)', left: '1.25rem' }}
				>
					<div className="h-full bg-muted" />
					<div
						className={cn(
							'absolute top-0 left-0 h-full transition-all duration-300',
							currentStep === 1 ? 'bg-primary' : 'bg-success'
						)}
						style={{
							width: currentStep === 1 ? '0%' : '100%',
						}}
					/>
				</div>
			</div>
		</div>
	);
};
