import { ResumeBasicDetailsForm } from '@/components/forms/ResumeBasicDetailsForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useMemo, useState } from 'react';

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

	const handleChange = (field: keyof typeof inputs, value: any) => {
		setInputs((prev) => ({ ...prev, [field]: value }));
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
					<ResumeBasicDetailsForm values={inputs} onChange={handleChange} />
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
