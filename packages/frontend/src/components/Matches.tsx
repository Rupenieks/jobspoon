import React, { useMemo } from "react";
import { useReadResumes } from "@/hooks/useReadResumes";
import { useMatchJobs } from "@/hooks/useMatchJobs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const MatchSkeleton: React.FC = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

const ResumeSkeleton: React.FC = () => (
  <Card className="mb-4">
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
);

const Matches: React.FC = () => {
  const { data: resumes, isLoading } = useReadResumes();
  const { mutate: matchJobs, isPending } = useMatchJobs();

  const handleMatchJobs = async (resumeId: string) => {
    await matchJobs(resumeId);
  };

  const ResumeList = useMemo(() => {
    if (isLoading) {
      return Array(3)
        .fill(0)
        .map((_, index) => <ResumeSkeleton key={index} />);
    }

    return resumes?.map((resume) => (
      <Accordion key={resume.id} type="single" collapsible className="mb-4">
        <AccordionItem value={resume.id}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {resume.positionName} - {resume.fullName}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Created{" "}
                  {formatDistanceToNow(new Date(resume.createdAt as string), {
                    addSuffix: true,
                  })}
                </span>
                <Button
                  onClick={() => handleMatchJobs(resume.id)}
                  disabled={isPending}
                >
                  {isPending ? "Matching..." : "Match Jobs"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AccordionTrigger>View Matches</AccordionTrigger>
              <AccordionContent>
                {isPending ? (
                  <div className="space-y-4">
                    {Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <MatchSkeleton key={index} />
                      ))}
                  </div>
                ) : resume.matches && resume.matches.length > 0 ? (
                  <ul className="space-y-4">
                    {resume.matches.map((match) => (
                      <li key={match.id} className="border-b pb-4">
                        <h3 className="font-semibold text-lg">
                          {match.positionTitle}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {match.companyName}
                        </p>
                        <p className="text-sm">
                          {match.city}, {match.country}
                        </p>
                        {match.description && (
                          <p className="text-sm mt-2">
                            {match.description.slice(0, 150)}...
                          </p>
                        )}
                        {match.applyUrl && (
                          <a
                            href={match.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-sm mt-2 inline-block"
                          >
                            Apply Now
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    No matches found. Click "Match Jobs" to find potential
                    opportunities.
                  </p>
                )}
              </AccordionContent>
            </CardContent>
          </Card>
        </AccordionItem>
      </Accordion>
    ));
  }, [resumes, isLoading, isPending, handleMatchJobs]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Job Matches</h1>
      <p className="mb-8">Explore job opportunities matched to your resumes.</p>
      {ResumeList}
    </div>
  );
};

export default Matches;
