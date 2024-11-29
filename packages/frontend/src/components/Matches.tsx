import { Skeleton } from '@/components/ui/skeleton';
import { useMatchJobs } from '@/hooks/useMatchJobs';
import { useReadApplications } from '@/hooks/useReadApplications';
import { useReadResumesWithMatches } from '@/hooks/useReadResumesWithMatches';
import CustomIcon from '@/icons/CustomIcon';
import { AlertCircle } from 'lucide-react';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeMatchCard from './ResumeMatchCard';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import useDocumentTitle from '@/hooks/useDocumentTitle';

const ResumeSkeleton: React.FC = () => (
	<div className="mb-4">
		<Skeleton className="h-32 w-full" />
	</div>
);

const Matches: React.FC = () => {
	const { resumes, jobRunsRemaining, isLoading } = useReadResumesWithMatches();
	const { mutate: matchJobs, isPending } = useMatchJobs();
	const navigate = useNavigate();
	useDocumentTitle('Matches');
	const handleMatchJobs = async (resumeId: string) => {
		matchJobs(resumeId);
	};

	const ResumeList = useMemo(() => {
		if (isLoading) {
			return Array(3)
				.fill(0)
				.map((_, index) => <ResumeSkeleton key={index} />);
		}

		if (resumes?.length === 0) {
			return (
				<div className="col-span-full text-center text-muted-foreground flex flex-col items-center justify-center mt-8">
					<div
						onClick={() => navigate('/resumes')}
						className="flex flex-col justify-center items-center cursor-pointer hover:bg-secondary transition-colors duration-200 rounded-lg p-4"
					>
						<CustomIcon name="no-data" className="h-48 w-48" />
						<span className="text-sm mt-2 font-medium">No resumes found</span>
						<span className="text-sm mt-2 text-muted-foreground">Click to go to resumes</span>
					</div>
				</div>
			);
		}

		return resumes?.map((resume) => (
			<ResumeMatchCard
				key={resume.id}
				resumeId={resume.id}
				isPending={isPending}
				onMatchJobs={handleMatchJobs}
			/>
		));
	}, [resumes, isLoading, isPending, handleMatchJobs]);

	return (
		<div className="container mx-auto px-4 flex flex-col">
			<div className="flex justify-between items-center">
				<div className="flex flex-col gap-1.5">
					<h1 className="text-2xl font-semibold tracking-tight">Matches</h1>
					<p className="text-sm text-muted-foreground">
						Here you can match your resumes to jobs based on the data you provided
					</p>
				</div>
				{jobRunsRemaining && jobRunsRemaining > 0 ? (
					<Alert className="w-fit items-center gap-2" variant="default">
						<AlertCircle className="h-4 w-4" />

						<AlertTitle>{jobRunsRemaining} job runs remaining today</AlertTitle>
						<AlertDescription>
							You may run a total of 3 job runs per <br /> day and only 1 job run per resume.
						</AlertDescription>
					</Alert>
				) : (
					<Alert className="w-fit items-center gap-2" variant="destructive">
						<AlertCircle className="h-4 w-4" />

						<AlertTitle>No job runs remaining today</AlertTitle>
						<AlertDescription>
							You may run a total of 3 job runs per <br /> day and only 1 job run per resume.
						</AlertDescription>
					</Alert>
				)}
			</div>
			<Separator className="my-6" />
			{ResumeList}
		</div>
	);
};

export default Matches;
