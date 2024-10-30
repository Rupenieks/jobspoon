import React, { useMemo, useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TApplication, TMatch, TResumeModel } from "@redundant/common";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Crosshair, Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ResumeMatchJobCard from "./ResumeJobCard";
import { useNavigate } from "react-router-dom";

interface ResumeMatchCardProps {
  resume: TResumeModel;
  isPending: boolean;
  onMatchJobs: (resumeId: string) => void;
}

const MatchSkeleton: React.FC = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

const ResumeMatchCard: React.FC<ResumeMatchCardProps> = ({
  resume,
  isPending,
  onMatchJobs,
}) => {
  const navigate = useNavigate();
  const matchCount = useMemo(
    () => resume.matches?.length || 0,
    [resume.matches]
  );

  const handleEditResume = useCallback(() => {
    navigate(`/resumes/${resume.id}`);
  }, [navigate, resume.id]);

  return (
    <Accordion type="single" collapsible className="mb-4">
      <AccordionItem value={resume.id}>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>
                {resume.data.positionName} - {resume.data.fullName}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Created{" "}
                {formatDistanceToNow(new Date(resume.createdAt as string), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditResume();
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Resume</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMatchJobs(resume.id);
                      }}
                      disabled={isPending}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Find matches</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 hover:bg-gray-100 p-1 rounded-md">
                      <Crosshair className="h-4 w-4" />
                      <span>{matchCount}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{matchCount} jobs found</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <AccordionTrigger />
            </div>
          </CardHeader>
          <CardContent>
            <AccordionContent>
              <Separator className="my-4" />
              {isPending ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <MatchSkeleton key={index} />
                    ))}
                </div>
              ) : resume.matches && resume.matches.length > 0 ? (
                <div className="space-y-4">
                  {resume.matches.map((match) => (
                    <Card key={match.id} className="p-4">
                      <ResumeMatchJobCard
                        match={match as TMatch & { application: TApplication }}
                        resumeId={resume.id}
                      />
                    </Card>
                  ))}
                </div>
              ) : (
                <p>
                  No matches found. Click the refresh button to find potential
                  opportunities.
                </p>
              )}
            </AccordionContent>
          </CardContent>
        </Card>
      </AccordionItem>
    </Accordion>
  );
};

export default ResumeMatchCard;
