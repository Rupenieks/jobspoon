import React from 'react';
import { Check, FileText, MessageCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApplicationStepperProps {
	currentStage: 'not_applied' | 'applied' | 'interview' | 'success' | 'rejected';
	onStageChange: (stage: 'not_applied' | 'applied' | 'interview' | 'success') => void;
}

const stages = [
	{ id: 'not_applied', label: 'Not Applied', icon: FileText },
	{ id: 'applied', label: 'Applied', icon: Check },
	{ id: 'interview', label: 'Interview', icon: MessageCircle },
	{ id: 'success', label: 'Success', icon: Star },
] as const;

const ApplicationStepper: React.FC<ApplicationStepperProps> = ({ currentStage, onStageChange }) => {
	const currentIndex = stages.findIndex((stage) => stage.id === currentStage);

	return (
		<div className="w-full">
			<div className="relative flex justify-between">
				{/* Progress Bar */}
				<div className="absolute top-1/2 h-0.5 w-full bg-gray-200 -translate-y-1/2" />
				<div
					className="absolute top-1/2 h-0.5 bg-primary transition-all -translate-y-1/2"
					style={{
						width: `${currentIndex === -1 ? 0 : (currentIndex / (stages.length - 1)) * 100}%`,
					}}
				/>

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
									'z-10 flex h-10 w-10 items-center justify-center rounded-full border-2',
									isActive && 'border-primary bg-primary text-primary-foreground',
									isCompleted && 'border-primary bg-primary text-primary-foreground',
									!isActive && !isCompleted && 'border-gray-300 bg-white'
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
		</div>
	);
};

export default ApplicationStepper;
