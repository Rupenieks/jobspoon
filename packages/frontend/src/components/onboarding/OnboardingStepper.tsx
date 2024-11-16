import { Check, User, Briefcase, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
	{ id: 1, label: 'Personal Info', icon: User },
	{ id: 2, label: 'Job Titles', icon: Briefcase },
	{ id: 3, label: 'Complete', icon: Star },
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
									'z-10 flex h-10 w-10 items-center justify-center rounded-full border-2',
									'transition-colors duration-200',
									isActive && 'border-primary bg-primary text-primary-foreground',
									isCompleted && 'border-primary bg-primary text-primary-foreground',
									!isActive &&
										!isCompleted &&
										'border-muted-foreground/25 bg-background text-muted-foreground'
								)}
							>
								{isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
							</div>
							<span
								className={cn(
									'mt-2 text-foreground text-sm font-medium transition-colors duration-200',
									isCompleted && 'text-primary',
									!isActive && !isCompleted && 'text-muted-foreground'
								)}
							>
								{step.label}
							</span>
						</div>
					);
				})}

				{/* Background lines */}
				<div className="absolute top-5 left-0 right-0 -translate-y-1/2">
					<div
						className="h-[2px] bg-muted"
						style={{
							width: 'calc(100% - 2.5rem)',
							marginLeft: '1.5rem',
						}}
					/>
				</div>

				{/* Progress lines */}
				<div className="absolute top-5 left-0 right-0 -translate-y-1/2">
					<div
						className="h-[2px] bg-accent transition-all duration-300"
						style={{
							width: `calc(${(currentStep - 1) * 50}% - 1.25rem)`,
							marginLeft: '1.5rem',
						}}
					/>
				</div>
			</div>
		</div>
	);
};
