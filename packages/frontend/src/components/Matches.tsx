import React, { useMemo } from 'react';
import { useReadResumesWithMatches } from '@/hooks/useReadResumesWithMatches';
import { useMatchJobs } from '@/hooks/useMatchJobs';
import { Skeleton } from '@/components/ui/skeleton';
import ResumeMatchCard from './ResumeMatchCard';
import { useReadApplications } from '@/hooks/useReadApplications';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';

const ResumeSkeleton: React.FC = () => (
	<div className="mb-4">
		<Skeleton className="h-32 w-full" />
	</div>
);

const Matches: React.FC = () => {
	const { resumes, jobRunsRemaining, isLoading } = useReadResumesWithMatches();
	const { mutate: matchJobs, isPending } = useMatchJobs();
	const { data: applications } = useReadApplications();

	const filteredResumes = useMemo(() => {
		return resumes?.filter((resume) => {
			return !applications?.some((application) => application.resumeId === resume.id);
		});
	}, [resumes, applications]);

	const handleMatchJobs = async (resumeId: string) => {
		matchJobs(resumeId);
	};

	const ResumeList = useMemo(() => {
		if (isLoading) {
			return Array(3)
				.fill(0)
				.map((_, index) => <ResumeSkeleton key={index} />);
		}

		return filteredResumes?.map((resume) => (
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
