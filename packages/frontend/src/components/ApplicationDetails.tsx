import React, { useMemo, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useReadApplication } from "@/hooks/useReadApplication";
import ResumeEditor from "./ResumeEditor";
import ResumePDFRenderer from "./resumes/ResumePDFRenderer";
import ResumePDFPreviewLoadingWrapper from "./resumes/ResumePDFPreviewLoadingWrapper";
import { TResume } from "@redundant/common/src";

const ApplicationDetails: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const {
    data: application,
    isLoading,
    error,
  } = useReadApplication(applicationId);
  const [editedResume, setEditedResume] = useState<TResume>(
    application?.resume as TResume
  );
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
    return <div>Loading...</div>;
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
          <ResumeEditor resume={editedResume} onUpdate={setEditedResume} />
        </div>
        <div className="w-1/2 h-full">
          <ResumePDFPreviewLoadingWrapper resume={editedResume} />
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
