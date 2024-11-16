import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResumeState } from '../resumes/ResumeStateContext';
import { TResumeData } from '@redundant/common/src';
import CustomIcon from '@/icons/CustomIcon';
import { Crosshair2Icon } from '@radix-ui/react-icons';
import { useMemo } from 'react';
import { ResumeBasicDetailsForm } from '../forms/ResumeBasicDetailsForm';

interface ResumeDetailsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onMatchJobs: () => void;
}

export function ResumeDetailsDialog({ isOpen, onClose, onMatchJobs }: ResumeDetailsDialogProps) {
	const { resume, updateResumePersonalInfo, updateResumeField, isPending } = useResumeState();

	const values = {
		positionTitle: resume?.data.personalInfo.positionName || '',
		country: resume?.data.personalInfo.country || '',
		city: resume?.data.personalInfo.city || '',
		skills: resume?.data.skills || [''],
	};

	const handleChange = (field: keyof typeof values, value: any) => {
		if (field === 'skills') {
			updateResumeField('skills', value);
		} else {
			const personalInfoField = field === 'positionTitle' ? 'positionName' : field;
			updateResumePersonalInfo(personalInfoField, value);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="min-w-[800px]">
				<DialogHeader>
					<DialogTitle>Update Resume Details</DialogTitle>
					<DialogDescription>
						Please provide the following details to help us find the most relevant job matches for
						you.
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<ResumeBasicDetailsForm values={values} onChange={handleChange} />
				</div>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						onClick={onMatchJobs}
						disabled={!values.country || !values.positionTitle || isPending}
					>
						Match Jobs <Crosshair2Icon className="w-4 h-4" />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
