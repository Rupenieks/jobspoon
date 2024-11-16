import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomIcon from '@/icons/CustomIcon';
import { useState } from 'react';
import { z } from 'zod';

const schema = z.object({
	fullName: z.string().min(1, 'Full name is required'),
	city: z.string().min(1, 'City is required'),
	country: z.string().min(1, 'Country is required'),
});

interface PersonalInfoStepProps {
	initialData: {
		fullName: string;
		city: string;
		country: string;
	};
	onSubmit: (data: z.infer<typeof schema>) => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ initialData, onSubmit }) => {
	const [formData, setFormData] = useState(initialData);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: '' }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const validatedData = schema.parse(formData);
			onSubmit(validatedData);
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: Record<string, string> = {};
				error.errors.forEach((err) => {
					if (err.path[0]) {
						newErrors[err.path[0] as string] = err.message;
					}
				});
				setErrors(newErrors);
			}
		}
	};

	return (
		<div className="max-w-2xl mx-auto space-y-12 bg-white/50 p-8 rounded-lg">
			<div className="text-center space-y-6">
				<CustomIcon name="jobspoon" className="w-40 h-24 mx-auto text-primary" />
				<div>
					<h1 className="text-3xl font-bold text-foreground">Tell us about yourself</h1>
					<p className="text-lg text-muted-foreground mt-2">
						Let's start with some basic information
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-8">
				<div className="space-y-6 max-w-lg mx-auto">
					<div className="space-y-3">
						<Label htmlFor="fullName" className="text-base">
							Full Name
						</Label>
						<Input
							id="fullName"
							value={formData.fullName}
							onChange={(e) => handleChange('fullName', e.target.value)}
							className="h-12 text-lg"
						/>
						{errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-3">
							<Label htmlFor="city" className="text-base">
								City
							</Label>
							<Input
								id="city"
								value={formData.city}
								onChange={(e) => handleChange('city', e.target.value)}
								className="h-12 text-lg"
							/>
							{errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
						</div>

						<div className="space-y-3">
							<Label htmlFor="country" className="text-base">
								Country
							</Label>
							<Input
								id="country"
								value={formData.country}
								onChange={(e) => handleChange('country', e.target.value)}
								className="h-12 text-lg"
							/>
							{errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
						</div>
					</div>
				</div>

				<div className="max-w-lg mx-auto">
					<Button type="submit" className="w-full h-12 text-lg">
						Continue
					</Button>
				</div>
			</form>
		</div>
	);
};
