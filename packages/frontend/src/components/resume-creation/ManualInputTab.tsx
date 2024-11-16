import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Plus, Minus } from 'lucide-react';
import CustomIcon from '@/icons/CustomIcon';
import { useState, useMemo } from 'react';

interface ManualInputTabProps {
	onSubmit: (data: {
		positionTitle: string;
		country: string;
		city: string;
		skills: string[];
	}) => void;
	isPending: boolean;
}

export const ManualInputTab = ({ onSubmit, isPending }: ManualInputTabProps) => {
	const [inputs, setInputs] = useState({
		positionTitle: '',
		country: '',
		city: '',
		skills: [''],
	});

	const handleAddSkill = () => {
		setInputs((prev) => ({
			...prev,
			skills: [...prev.skills, ''],
		}));
	};

	const handleRemoveSkill = (index: number) => {
		setInputs((prev) => ({
			...prev,
			skills: prev.skills.filter((_, i) => i !== index),
		}));
	};

	const handleSkillChange = (index: number, value: string) => {
		setInputs((prev) => ({
			...prev,
			skills: prev.skills.map((skill, i) => (i === index ? value : skill)),
		}));
	};

	const isSubmitDisabled = useMemo(() => {
		const hasRequiredFields =
			!inputs.positionTitle.trim() || !inputs.country.trim() || !inputs.city.trim();

		const hasAtLeastOneSkill = inputs.skills.some((skill) => skill.trim() !== '');

		return hasRequiredFields || !hasAtLeastOneSkill;
	}, [inputs]);

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-auto">
				<div className="space-y-6 p-4">
					<div className="flex gap-8">
						<div className="flex-1 space-y-4">
							<div className="space-y-2">
								<Label>Position Title</Label>
								<Input
									value={inputs.positionTitle}
									onChange={(e) =>
										setInputs((prev) => ({ ...prev, positionTitle: e.target.value }))
									}
									placeholder="e.g., Frontend Developer"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Country</Label>
									<Input
										value={inputs.country}
										onChange={(e) => setInputs((prev) => ({ ...prev, country: e.target.value }))}
										placeholder="e.g., United States"
									/>
								</div>
								<div className="space-y-2">
									<Label>City</Label>
									<Input
										value={inputs.city}
										onChange={(e) => setInputs((prev) => ({ ...prev, city: e.target.value }))}
										placeholder="e.g., New York"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Skills</Label>
								<ScrollArea className="bg-mute rounded-md max-h-24 h-24">
									<div className="grid grid-cols-3 gap-2 p-2">
										{inputs.skills.map((skill, index) => (
											<div key={index} className="flex gap-2">
												<Input
													value={skill}
													onChange={(e) => handleSkillChange(index, e.target.value)}
													placeholder={`Skill ${index + 1}`}
													className="h-8"
												/>
												{(index === inputs.skills.length - 1 || index > 0) && (
													<div className="flex gap-1">
														{index === inputs.skills.length - 1 && (
															<Button
																type="button"
																variant="outline"
																size="icon"
																onClick={handleAddSkill}
																className="h-8 w-8"
															>
																<Plus className="h-3 w-3" />
															</Button>
														)}
														{index > 0 && (
															<Button
																type="button"
																variant="outline"
																size="icon"
																onClick={() => handleRemoveSkill(index)}
																className="h-8 w-8"
															>
																<Minus className="h-3 w-3" />
															</Button>
														)}
													</div>
												)}
											</div>
										))}
									</div>
								</ScrollArea>
							</div>
						</div>
						<div className="flex-shrink-0 w-48">
							<CustomIcon name="create" className="w-48 h-48" />
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-between items-center gap-4 bg-background">
				<Alert variant="info" className="bg-blue-500/10 border-blue-500/20">
					<Info className="h-4 w-4" />
					<AlertTitle>Required fields</AlertTitle>
					<AlertDescription>
						Don't worry, you can add the rest later. This is the minimum information required to
						search for jobs.
					</AlertDescription>
				</Alert>
				<div className="flex flex-col justify-end h-full">
					<Button onClick={() => onSubmit(inputs)} disabled={isSubmitDisabled || isPending}>
						Create Resume
					</Button>
				</div>
			</div>
		</div>
	);
};
