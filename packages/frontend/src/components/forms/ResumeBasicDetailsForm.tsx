import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import CustomIcon from '@/icons/CustomIcon';

interface ResumeBasicDetails {
	positionTitle: string;
	country: string;
	city: string;
	skills: string[];
}

interface ResumeBasicDetailsFormProps {
	values: ResumeBasicDetails;
	onChange: (field: keyof ResumeBasicDetails, value: any) => void;
}

export const ResumeBasicDetailsForm = ({ values, onChange }: ResumeBasicDetailsFormProps) => {
	const handleAddSkill = () => {
		onChange('skills', [...values.skills, '']);
	};

	const handleRemoveSkill = (index: number) => {
		onChange(
			'skills',
			values.skills.filter((_, i) => i !== index)
		);
	};

	const handleSkillChange = (index: number, value: string) => {
		onChange(
			'skills',
			values.skills.map((skill, i) => (i === index ? value : skill))
		);
	};

	return (
		<div className="flex gap-8">
			<div className="flex-1 space-y-4">
				<div className="space-y-2">
					<Label>Position Title</Label>
					<Input
						value={values.positionTitle}
						onChange={(e) => onChange('positionTitle', e.target.value)}
						placeholder="e.g., Frontend Developer"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>Country</Label>
						<Input
							value={values.country}
							onChange={(e) => onChange('country', e.target.value)}
							placeholder="e.g., United States"
						/>
					</div>
					<div className="space-y-2">
						<Label>City</Label>
						<Input
							value={values.city}
							onChange={(e) => onChange('city', e.target.value)}
							placeholder="e.g., New York"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label>Skills</Label>
					<ScrollArea className="bg-mute rounded-md max-h-24 h-24">
						<div className="grid grid-cols-3 gap-2 p-2">
							{values.skills.map((skill, index) => (
								<div key={index} className="flex gap-2">
									<Input
										value={skill}
										onChange={(e) => handleSkillChange(index, e.target.value)}
										placeholder={`Skill ${index + 1}`}
										className="h-8"
									/>
									{(index === values.skills.length - 1 || index > 0) && (
										<div className="flex gap-1">
											{index === values.skills.length - 1 && (
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
				<CustomIcon name={'create'} className="w-48 h-48" />
			</div>
		</div>
	);
};
