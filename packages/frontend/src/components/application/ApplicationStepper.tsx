import React from 'react';
import { Check, FileText, MessageCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ApplicationStepperProps {
	currentStage: 'not_applied' | 'applied' | 'interview' | 'success' | 'rejected';
	onStageChange: (stage: 'not_applied' | 'applied' | 'interview' | 'success') => void;
	applicationStage: 'not_applied' | 'applied' | 'interview' | 'success' | 'rejected';
}

const stages = [
	{ id: 'not_applied', label: 'Not Applied', icon: FileText },
	{ id: 'applied', label: 'Applied', icon: Check },
	{ id: 'interview', label: 'Interview', icon: MessageCircle },
	{ id: 'success', label: 'Success', icon: Star },
] as const;

const ApplicationStepper: React.FC<ApplicationStepperProps> = ({
	currentStage,
	onStageChange,
	applicationStage,
}) => {
	const currentIndex = stages.findIndex((stage) => stage.id === applicationStage);
	const progressPercentage = currentIndex === -1 ? 0 : (currentIndex / (stages.length - 1)) * 100;
	return (
		<div className="w-full">
			<div className="relative flex flex-col justify-between mb-8 gap-4">
				<div className="flex justify-between">
					{/* Steps */}
					{stages.map((stage, index) => {
						const Icon = stage.icon;
						const isActive = currentStage === stage.id;
						const isCompleted = currentIndex > index;
						const isClickable = index <= currentIndex + 1;

						return (
							<div
								key={stage.id}
								className={cn(
									'relative flex flex-col items-center',
									isClickable && 'cursor-pointer',
									!isClickable && 'opacity-50'
								)}
								onClick={() => isClickable && onStageChange(stage.id)}
							>
								<div
									className={cn(
										'z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background',
										isActive && 'border-primary bg-primary text-primary-foreground',
										isCompleted && 'border-primary bg-primary text-primary-foreground',
										!isActive && !isCompleted && 'border-gray-300'
									)}
								>
									<Icon className="h-5 w-5" />
								</div>
								<span
									className={cn(
										'mt-2 text-sm font-medium',
										isActive && 'text-primary',
										!isActive && 'text-gray-500'
									)}
								>
									{stage.label}
								</span>
							</div>
						);
					})}
				</div>

				<Progress value={progressPercentage} className="h-1" />
			</div>
		</div>
	);
};

export default ApplicationStepper;
