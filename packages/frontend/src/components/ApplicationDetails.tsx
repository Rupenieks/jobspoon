import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useReadApplication } from "@/hooks/useReadApplication";
import { TResume } from "@redundant/common/src";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft } from "lucide-react";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ResumeEditor from "./ResumeEditor";
import ResumePDFPreviewLoadingWrapper from "./resumes/ResumePDFPreviewLoadingWrapper";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { useUpdateResume } from "@/hooks/useUpdateResume";

const LoadingSkeleton: React.FC = React.memo(() => (
  <div className="container mx-auto p-4">
    <Skeleton className="w-40 h-10 mb-4" />
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="w-1/3 h-8" />
        <Skeleton className="w-1/4 h-4" />
      </div>
      <Skeleton className="w-1/2 h-6 mb-2" />
      <Skeleton className="w-full h-4 mb-4" />
      <Skeleton className="w-1/3 h-4" />
    </div>
    <Separator className="my-6" />
    <div className="flex gap-6 h-full">
      <Skeleton className="w-1/2 h-96" />
      <Skeleton className="w-1/2 h-96" />
    </div>
  </div>
));

const ApplicationDetails: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const {
    data: application,
    isLoading,
    error,
  } = useReadApplication(applicationId);
  const { mutate: updateResume } = useUpdateResume();

  const [editedResume, setEditedResume] = useState<TResume | null>(null);

  // Debounce the editedResume to reduce the number of updates
  const debouncedResume = useDebouncedValue(editedResume, 1000);

  useEffect(() => {
    if (application?.resume) {
      setEditedResume(application.resume as TResume);
    }
  }, [application?.resume]);

  useEffect(() => {
    if (debouncedResume && debouncedResume.id) {
      const { matches, application, ...resumeToUpdate } = debouncedResume;
      updateResume({ id: debouncedResume.id, resume: resumeToUpdate });
    }
  }, [debouncedResume, updateResume]);

  const handleGoBack = useCallback(() => {
    navigate("/applications");
  }, [navigate]);

  const formattedPostedDate = useMemo(() => {
    if (application?.match.createdAt) {
      return formatDistanceToNow(new Date(application.match.createdAt), {
        addSuffix: true,
      });
    }
    return "";
  }, [application?.match.createdAt]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !application) {
    return <div>Error loading application details</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={handleGoBack} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Applications
      </Button>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            {application.match.positionTitle}
          </h1>
          <span className="text-sm text-gray-500">
            Posted {formattedPostedDate}
          </span>
        </div>
        <p className="text-lg mb-2">{application.match.companyName}</p>
        <p className="mb-4">{application.match.description}</p>
        <p className="text-sm text-gray-600">
          {application.match.city}, {application.match.country}
        </p>
      </div>

      <Separator className="my-6" />

      <div className="flex gap-6 h-full">
        <div className="w-1/2">
          <ResumeEditor
            resume={editedResume as TResume}
            onUpdate={setEditedResume}
          />
        </div>
        <div className="w-1/2 h-full">
          <ResumePDFPreviewLoadingWrapper resume={editedResume as TResume} />
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
