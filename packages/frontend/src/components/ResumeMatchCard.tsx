import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
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
import { toast } from "@/hooks/use-toast";
import { useCreateApplication } from "@/hooks/useCreateApplication";
import { useReadApplications } from "@/hooks/useReadApplications";
import { ToastAction } from "@radix-ui/react-toast";
import { TResumeWithMatches } from "@redundant/common";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, CheckCircle2, Crosshair, ExternalLink, FileText, MoreVertical, Pencil, Plus, RefreshCw } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobMatchDrawer from "./JobMatchDrawer";

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
  const { mutateAsync: createApplication } = useCreateApplication();
  const { data: applications } = useReadApplications();
  const [selectedMatchId, setSelectedMatchId] = useState<string | undefined>(undefined);

  const matchHasApplication = useCallback((matchId: string) => {
    return applications?.some((application) => application.matchId === matchId);
  }, [applications]);

  const handleEditResume = useCallback(() => {
    navigate(`/resumes/${resume.id}`);
  }, [navigate, resume.id]);

  const handleCreateApplication = useCallback(async (matchId: string) => {
    if (!matchId) return;
    const application = await createApplication({ resumeId: resume.id, matchId });
    toast({
      title: "Application created",
      description: 'Resume matched to job. Click the button below to view the application.',
      action: <ToastAction altText="Dismiss" onClick={() => {
        navigate(`/applications/${application.id}`);
      }}>Click</ToastAction>
    });
  }, [createApplication, resume.id]);

  const handleGoToApplication = useCallback((applicationId: string) => {
    navigate(`/applications/${applicationId}`);
  }, [navigate]);

  const getApplicationId = useCallback((matchId: string) => {
    return applications?.find(app => app.matchId === matchId)?.id;
  }, [applications]);

  return (
    <Accordion type="single" collapsible className="mb-6 border-l-4" style={{borderLeftColor: resume.data.config.sidebarColor}}>
      <AccordionItem value={resume.id} className="border-none">
        <AccordionTrigger className={`hover:no-underline py-4 px-4 border-t-2 border-r-2 border-b-2`} >
          <div className="flex items-center justify-between w-full">
            <div className="flex-1">
              <div className="text-left">
                <h3 className="font-semibold text-lg leading-tight mb-1">
                  {resume.data.personalInfo.positionName}
                </h3>
                <p className="text-sm text-gray-500 text-muted-foreground">
                  {resume.data.personalInfo.fullName} • Created{" "}
                  {formatDistanceToNow(new Date(resume.createdAt as string), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Crosshair className="h-4 w-4" />
                <span>{matchCount} matches</span>
              </div>
              <div className="flex items-center gap-2 mr-4">
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
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          <div >
            {isPending ? (
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
                  {[...Array(4)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-[140px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : resume.matches && resume.matches.length > 0 ? (
              <Table className="border border-gray-200 rounded-m h-full pb-0">
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Seniority</TableHead>
                    <TableHead>Application</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resume.matches.map((match) => (
                    <TableRow 
                      key={match.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedMatchId(match.id)}
                    >
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
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (matchHasApplication(match.id)) {
                                    const appId = getApplicationId(match.id);
                                    if (appId) handleGoToApplication(appId);
                                  } else {
                                    handleCreateApplication(match.id);
                                  }
                                }}
                              >
                                {matchHasApplication(match.id) ? (
                                  <>
                                    <ArrowRight className="h-4 w-4" />
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                  </>
                                ) : (
                                  <>
                                    <FileText className="h-4 w-4" />
                                    <Plus className="h-4 w-4" />
                                  </>
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {matchHasApplication(match.id) 
                                ? "Go to application" 
                                : "Create application"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-40" align="end">
                            <div className="space-y-1">
                              {match.applyUrl && (
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onClick={() => {
                                    if (match.applyUrl) {
                                      window.open(match.applyUrl, "_blank");
                                    }
                                  }}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Apply Direct
                                </Button>
                              )}
        
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="h-24 flex items-center justify-center border border-gray-200 rounded-m items-center justify-center">
                <span className="text-muted-foreground">
                  Hit refresh to find jobs. 
                </span>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
      <JobMatchDrawer
        matchId={selectedMatchId}
        isOpen={!!selectedMatchId}
        onClose={() => setSelectedMatchId(null)}
      />
    </Accordion>
  );
};

export default ResumeMatchCard;
