import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TResumeWithMatches } from "@redundant/common";
import { formatDistanceToNow } from "date-fns";
import { Crosshair, ExternalLink, Pencil, RefreshCw } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface ResumeMatchCardProps {
  resume: TResumeWithMatches;
  isPending: boolean;
  onMatchJobs: (resumeId: string) => void;
}

const ResumeMatchCard: React.FC<ResumeMatchCardProps> = ({
  resume,
  isPending,
  onMatchJobs,
}) => {
  const navigate = useNavigate();
  const matchCount = useMemo(() => resume.matches?.length || 0, [resume.matches]);

  const handleEditResume = useCallback(() => {
    navigate(`/resumes/${resume.id}`);
  }, [navigate, resume.id]);

  return (
    <Accordion type="single" collapsible className="mb-6">
      <AccordionItem value={resume.id} className="border rounded-lg shadow-sm">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {resume.data.personalInfo.positionName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {resume.data.personalInfo.fullName} • Created{" "}
                  {formatDistanceToNow(new Date(resume.createdAt as string), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Crosshair className="h-4 w-4" />
                <span>{matchCount} matches</span>
              </div>
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
                  <TooltipContent>Edit Resume</TooltipContent>
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
                  <TooltipContent>Find matches</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-6 py-4">
            {isPending ? (
              <div className="h-32 flex items-center justify-center">
                <p className="text-muted-foreground">Finding matches...</p>
              </div>
            ) : resume.matches && resume.matches.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Seniority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resume.matches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell className="font-medium">
                        {match.positionTitle}
                      </TableCell>
                      <TableCell>
                        {match.companyName || "Company not specified"}
                      </TableCell>
                      <TableCell>
                        {match.city}, {match.country}
                      </TableCell>
                      <TableCell>{match.seniority || "Not specified"}</TableCell>
                      <TableCell className="text-right">
                        {match.applyUrl && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => window.open(match.applyUrl || "", "_blank")}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Apply for position</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="h-32 flex items-center justify-center">
                <p className="text-muted-foreground">
                  No matches found. Click the refresh button to find potential
                  opportunities.
                </p>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ResumeMatchCard;
