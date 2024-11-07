import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useReadApplication } from "@/hooks/useReadApplication";
import { formatDistanceToNow } from "date-fns";
import { Building2, MapPin, Calendar, ExternalLink, ChevronLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ResumeEditingWrapper from "./resumes/ResumeEditingWrapper";
import { ResumeStateProvider } from "./resumes/ResumeStateContext";

const LoadingSkeleton: React.FC = React.memo(() => (
  <div className="container mx-auto p-4 space-y-8">
    {/* Back Button Skeleton */}
    <Skeleton className="w-40 h-10" />

    {/* Job Information Section Skeleton */}
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="w-64 h-8" /> {/* Job Title */}
            <div className="space-y-1">
              <Skeleton className="w-48 h-4" /> {/* Company Name */}
              <Skeleton className="w-40 h-4" /> {/* Location */}
            </div>
          </div>
          <Skeleton className="w-32 h-4" /> {/* Posted Date */}
        </div>

        {/* Job Description Skeleton */}
        <div className="border rounded-lg p-4">
          <Skeleton className="w-40 h-5 mb-2" /> {/* Description Header */}
          <div className="space-y-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
          </div>
        </div>
      </div>
    </div>

    <Separator />

    {/* Resume Editor Section Skeleton */}
    <div className="bg-white shadow-md rounded-lg p-6">
      <Skeleton className="w-32 h-6 mb-4" /> {/* Resume Header */}
      <div className="space-y-4">
        <Skeleton className="w-full h-[400px]" /> {/* Resume Editor */}
      </div>
    </div>

    <Separator />

    {/* Application Details Section Skeleton */}
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <Skeleton className="w-40 h-6" /> {/* Notes Header */}
        <Skeleton className="w-full h-[150px]" /> {/* Notes Textarea */}
      </div>

      <div className="space-y-2">
        <Skeleton className="w-40 h-6" /> {/* Status Header */}
        <Skeleton className="w-full h-10" /> {/* Status Select */}
      </div>
    </div>
  </div>
));



const ApplicationDetails: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { data: application, isLoading } = useReadApplication(applicationId);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("started");

  const resumeId = useMemo(
    () => application?.resume.id,
    [application?.resume.id]
  );

  const handleGoBack = useCallback(() => {
    navigate("/applications");
  }, [navigate]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!application || !resumeId) {
    return <div>Error loading application details</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Button variant="ghost" onClick={handleGoBack}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Applications
      </Button>

      {/* Job Information Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {application.match.positionTitle}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{application.match.companyName}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {application.match.city}, {application.match.country}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Posted {formatDistanceToNow(new Date(application.match.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>

          <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
            <h3 className="font-semibold mb-2">Job Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {application.match.description}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Resume Editor Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Resume</h2>
        <ResumeStateProvider resumeId={resumeId}>
          <ResumeEditingWrapper />
        </ResumeStateProvider>
      </div>

      <Separator />

      {/* Application Details Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="font-semibold">Application Notes</h3>
          <Textarea
            placeholder="Add notes about your application..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[150px]"
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Application Status</h3>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="started">
                <Badge variant="secondary">Started</Badge>
              </SelectItem>
              <SelectItem value="applied">
                <Badge variant="default">Applied</Badge>
              </SelectItem>
              <SelectItem value="in_progress">
                <Badge variant="secondary">In Progress</Badge>
              </SelectItem>
              <SelectItem value="success">
                <Badge variant="default">Success</Badge>
              </SelectItem>
              <SelectItem value="rejected">
                <Badge variant="destructive">Rejected</Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
