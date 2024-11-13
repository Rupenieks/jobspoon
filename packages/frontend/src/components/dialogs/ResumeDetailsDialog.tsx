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

interface ResumeDetailsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onMatchJobs: () => void;
}

export function ResumeDetailsDialog({ isOpen, onClose, onMatchJobs }: ResumeDetailsDialogProps) {
	const { resume, updateResumePersonalInfo, isPending } = useResumeState();

	const handleChange = (field: keyof TResumeData['personalInfo'], value: string) => {
		updateResumePersonalInfo(field, value);
	};

	const matchJobsDisabled = useMemo(
		() => !resume?.data.personalInfo.country || !resume?.data.personalInfo.positionName,
		[resume?.data.personalInfo.country, resume?.data.personalInfo.positionName]
	);

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
				<div className="grid gap-4 py-4 w-full">
					<div className="flex justify-center">
						<CustomIcon name="personal-info" className="w-72 h-72" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="positionName">Position Title</Label>
						<Input
							id="positionName"
							value={resume?.data.personalInfo.positionName || ''}
							onChange={(e) => handleChange('positionName', e.target.value)}
							placeholder="e.g., Frontend Developer"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="country">Country</Label>
						<Input
							id="country"
							value={resume?.data.personalInfo.country || ''}
							onChange={(e) => handleChange('country', e.target.value)}
							placeholder="e.g., United States"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="city">City (optional)</Label>
						<Input
							id="city"
							value={resume?.data.personalInfo.city || ''}
							onChange={(e) => handleChange('city', e.target.value)}
							placeholder="e.g., San Francisco"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={onMatchJobs} disabled={matchJobsDisabled || isPending}>
						Match Jobs <Crosshair2Icon className="w-4 h-4" />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
