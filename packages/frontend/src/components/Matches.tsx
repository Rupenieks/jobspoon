import React, { useMemo } from "react";
import { useReadResumesWithMatches } from "@/hooks/useReadResumesWithMatches";
import { useMatchJobs } from "@/hooks/useMatchJobs";
import { Skeleton } from "@/components/ui/skeleton";
import ResumeMatchCard from "./ResumeMatchCard";
import { useReadApplications } from "@/hooks/useReadApplications";
import { Separator } from "./ui/separator";

const ResumeSkeleton: React.FC = () => (
  <div className="mb-4">
    <Skeleton className="h-32 w-full" />
  </div>
);

const Matches: React.FC = () => {
  const { data: resumes, isLoading } = useReadResumesWithMatches();
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
        resume={resume}
        isPending={isPending}
        onMatchJobs={handleMatchJobs}
      />
    ));
  }, [resumes, isLoading, isPending, handleMatchJobs]);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Matches</h1>
      <span className="mb-4 text-md text-gray-500">Here you can match your resumes to jobs based on the data you provided.</span>

      <Separator className="my-4 mb-8" />
      {ResumeList}
    </div>
  );
};

export default Matches;
