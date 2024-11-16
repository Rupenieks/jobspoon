import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomIcon from '@/icons/CustomIcon';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

const schema = z.object({
	desiredJobTitles: z
		.array(z.string().min(1, 'Job title is required'))
		.min(1, 'At least one job title is required')
		.max(3, 'Maximum 3 job titles allowed'),
	seekingRemote: z.boolean(),
});

interface JobTitlesStepProps {
	initialData: {
		desiredJobTitles: string[];
		isRemoteOk: boolean;
	};
	onSubmit: (data: z.infer<typeof schema>) => void;
	onBack: () => void;
}

export const JobTitlesStep: React.FC<JobTitlesStepProps> = ({ initialData, onSubmit, onBack }) => {
	const [formData, setFormData] = useState({
		desiredJobTitles: initialData.desiredJobTitles,
		seekingRemote: initialData.isRemoteOk,
	});
	const [errors, setErrors] = useState<{ message?: string; index?: number }>();

	const handleJobTitleChange = (index: number, value: string) => {
		const newJobTitles = [...formData.desiredJobTitles];
		newJobTitles[index] = value;
		setFormData((prev) => ({ ...prev, desiredJobTitles: newJobTitles }));
		setErrors(undefined);
	};

	const handleAddJobTitle = () => {
		if (formData.desiredJobTitles.length < 3) {
			setFormData((prev) => ({
				...prev,
				desiredJobTitles: [...prev.desiredJobTitles, ''],
			}));
			setErrors(undefined);
		}
	};

	const handleRemoveJobTitle = (index: number) => {
		setFormData((prev) => ({
			...prev,
			desiredJobTitles: prev.desiredJobTitles.filter((_, i) => i !== index),
		}));
		setErrors(undefined);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const validatedData = schema.parse(formData);
			onSubmit(validatedData);
		} catch (error) {
			if (error instanceof z.ZodError) {
				const firstError = error.errors[0];
				if (firstError.path[0] === 'desiredJobTitles') {
					if (typeof firstError.path[1] === 'number') {
						setErrors({ index: firstError.path[1], message: firstError.message });
					} else {
						setErrors({ message: firstError.message });
					}
				}
			}
		}
	};

	return (
		<div className="max-w-2xl mx-auto space-y-12 bg-white/50 p-8 rounded-lg">
			<div className="text-center space-y-6">
				<CustomIcon name="online-resume" className="w-40 h-40 mx-auto text-primary" />
				<div>
					<h1 className="text-3xl font-bold text-foreground">What roles interest you?</h1>
					<p className="text-lg text-muted-foreground mt-2">
						Add up to 3 job titles you're interested in
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-8">
				<div className="space-y-6 max-w-lg mx-auto">
					<AnimatePresence mode="popLayout">
						{formData.desiredJobTitles.map((title, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.2, ease: 'easeOut' }}
								className="space-y-3"
							>
								<div className="flex gap-3">
									<Input
										id={`jobTitle-${index}`}
										value={title}
										onChange={(e) => handleJobTitleChange(index, e.target.value)}
										placeholder="e.g., Frontend Developer"
										className="h-12 text-lg"
									/>
									{formData.desiredJobTitles.length < 3 &&
										index === formData.desiredJobTitles.length - 1 && (
											<Button
												type="button"
												variant="outline"
												size="icon"
												onClick={handleAddJobTitle}
												className="h-12 w-12 shrink-0"
											>
												<Plus className="h-5 w-5" />
											</Button>
										)}
									{index > 0 && (
										<Button
											type="button"
											variant="outline"
											size="icon"
											onClick={() => handleRemoveJobTitle(index)}
											className="h-12 w-12 shrink-0"
										>
											<Minus className="h-5 w-5" />
										</Button>
									)}
								</div>
								{errors?.index === index && (
									<p className="text-sm text-destructive">{errors.message}</p>
								)}
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				<div className="space-y-6 max-w-lg mx-auto">
					<div className="flex items-center space-x-3 bg-secondary p-4 rounded-lg">
						<Checkbox
							id="seekingRemote"
							checked={formData.seekingRemote}
							onCheckedChange={(checked) =>
								setFormData((prev) => ({ ...prev, seekingRemote: checked === true }))
							}
						/>
						<Label htmlFor="seekingRemote" className="text-base text-foreground">
							I'm open to remote work opportunities
						</Label>
					</div>

					{errors && !errors.index && (
						<p className="text-sm text-destructive text-center">{errors.message}</p>
					)}

					<div className="flex gap-4">
						<Button type="button" variant="ghost" className="flex-1 h-12 text-lg" onClick={onBack}>
							<ArrowLeft className="h-5 w-5 mr-2" />
						</Button>
						<Button type="submit" className="flex-1 h-12 text-lg">
							Complete Setup
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
};
