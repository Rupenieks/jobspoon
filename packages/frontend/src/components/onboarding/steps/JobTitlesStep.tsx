import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomIcon from '@/icons/CustomIcon';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

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
		<div className="max-w-2xl mx-auto space-y-12">
			<div className="text-center space-y-6">
				<CustomIcon name="online-resume" className="w-40 h-40 mx-auto text-purple-500" />
				<div>
					<h1 className="text-3xl font-bold text-purple-900">What roles interest you?</h1>
					<p className="text-lg text-purple-600 mt-2">
						Add up to 3 job titles you're interested in
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-8">
				<div className="space-y-6">
					{formData.desiredJobTitles.map((title, index) => (
						<div key={index} className="space-y-3">
							<Label htmlFor={`jobTitle-${index}`} className="text-base">
								Job Title {index + 1}
							</Label>
							<div className="flex gap-3">
								<Input
									id={`jobTitle-${index}`}
									value={title}
									onChange={(e) => handleJobTitleChange(index, e.target.value)}
									placeholder="e.g., Frontend Developer"
									className="h-12 text-lg border-purple-100 focus:border-purple-300"
								/>
								{index > 0 && (
									<Button
										type="button"
										variant="outline"
										size="icon"
										onClick={() => handleRemoveJobTitle(index)}
										className="h-12 w-12 border-purple-100 hover:border-purple-300"
									>
										<Minus className="h-5 w-5" />
									</Button>
								)}
							</div>
							{errors?.index === index && <p className="text-sm text-red-500">{errors.message}</p>}
						</div>
					))}
				</div>

				{formData.desiredJobTitles.length < 3 && (
					<Button
						type="button"
						variant="outline"
						className="w-full h-12 text-lg border-purple-100 hover:border-purple-300"
						onClick={handleAddJobTitle}
					>
						<Plus className="h-5 w-5 mr-2" />
						Add Another Job Title
					</Button>
				)}

				<div className="space-y-6">
					<div className="flex items-center space-x-3 bg-purple-50 p-4 rounded-lg">
						<Checkbox
							id="seekingRemote"
							checked={formData.seekingRemote}
							onCheckedChange={(checked) =>
								setFormData((prev) => ({ ...prev, seekingRemote: checked === true }))
							}
							className="border-purple-300"
						/>
						<Label htmlFor="seekingRemote" className="text-base text-purple-900">
							I'm open to remote work opportunities
						</Label>
					</div>

					{errors && !errors.index && (
						<p className="text-sm text-red-500 text-center">{errors.message}</p>
					)}

					<div className="flex gap-4">
						<Button
							type="button"
							variant="outline"
							className="flex-1 h-12 text-lg border-purple-100 hover:border-purple-300"
							onClick={onBack}
						>
							Back
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
