import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteResumes } from '@/hooks/useDeleteResumes';
import { useReadApplications } from '@/hooks/useReadApplications';
import { useReadResumes } from '@/hooks/useReadResumes';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateResumeDialog from './CreateResumeDialog';
import { Separator } from './ui/separator';
import { ResumeCard } from './ResumeCard';

const ResumeList: React.FC = () => {
	const { data: resumes, isLoading, error } = useReadResumes();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedResumes, setSelectedResumes] = useState<Set<string>>(new Set());
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const navigate = useNavigate();
	const { mutate: deleteResumes } = useDeleteResumes();

	const handleResumeClick = useCallback(
		(resumeId: string) => {
			navigate(`/resumes/${resumeId}`);
		},
		[navigate]
	);

	const handleCheckboxChange = useCallback((resumeId: string, checked: boolean) => {
		setSelectedResumes((prev) => {
			const newSet = new Set(prev);
			if (checked) {
				newSet.add(resumeId);
			} else {
				newSet.delete(resumeId);
			}
			return newSet;
		});
	}, []);

	const handleDeleteClick = useCallback(() => {
		setIsDeleteDialogOpen(true);
	}, []);

	const handleDeleteConfirm = useCallback(() => {
		deleteResumes(Array.from(selectedResumes));
		setSelectedResumes(new Set());
		setIsDeleteDialogOpen(false);
	}, [deleteResumes, selectedResumes]);

	const ResumeCards = useMemo(() => {
		if (error) {
			return (
				<div className="col-span-full text-center text-destructive">
					Error loading resumes. Please try again later.
				</div>
			);
		}

		return Array(isLoading ? 6 : 0)
			.fill(0)
			.map((_, index) => <ResumeCard key={index} isLoading />)
			.concat(
				resumes?.map((resume) => (
					<ResumeCard
						key={resume.id}
						resume={resume}
						isSelected={selectedResumes.has(resume.id)}
						onCheckboxChange={(checked) => handleCheckboxChange(resume.id, checked)}
						onClick={() => handleResumeClick(resume.id)}
					/>
				)) || []
			);
	}, [resumes, isLoading, error, handleResumeClick, selectedResumes, handleCheckboxChange]);

	return (
		<div className="container mx-auto px-4 flex flex-col">
			<div className="flex justify-between items-center">
				<div className="flex flex-col gap-1.5">
					<h1 className="text-2xl font-semibold tracking-tight">Resumes</h1>
					<p className="text-sm text-muted-foreground">
						Here you can access the resumes you have created
					</p>
				</div>
				<div className="flex items-center space-x-4">
					<Button
						variant="destructive"
						size="icon"
						onClick={handleDeleteClick}
						disabled={selectedResumes.size === 0}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
					<Button variant="default" size="icon" onClick={() => setIsDialogOpen(true)}>
						<Plus className="h-4 w-4" />
					</Button>
					<CreateResumeDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
				</div>
			</div>
			<Separator className="my-6" />

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{ResumeCards}</div>

			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete {selectedResumes.size} selected resume
							{selectedResumes.size > 1 ? 's' : ''}. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default ResumeList;
