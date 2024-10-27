import React, { useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { TResume } from "@redundant/common/src";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import ResumeEditor from "./ResumeEditor";
import { Separator } from "@/components/ui/separator";
import ResumePDFPreviewLoadingWrapper from "./resumes/ResumePDFPreviewLoadingWrapper";
import { useUpdateResume } from "@/hooks/useUpdateResume";
import { useReadResume } from "@/hooks/useReadResume";
import { ResumeSkeleton } from "./skeletons/ResumeSkeleton";

const ResumeDetails: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const { data: resume, isLoading, error } = useReadResume(resumeId!);
  const { mutate: updateResume } = useUpdateResume();

  const debouncedResume = useDebouncedValue(resume, 1000);

  const handleResumeUpdate = useCallback(
    (updatedResume: TResume) => {
      if (resumeId) {
        const { matches, application, ...resumeToUpdate } = updatedResume;
        updateResume({ id: resumeId, resume: resumeToUpdate });
      }
    },
    [resumeId, updateResume]
  );

  if (isLoading) {
    return <ResumeSkeleton />;
  }

  if (error || !resume) {
    return <div>Error loading resume</div>;
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/resumes")}
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Resumes
      </Button>

      <h1 className="text-2xl font-bold">{resume.positionName}</h1>

      <div className="flex gap-6">
        <div className="w-1/2 space-y-8">
          <ResumeEditor resume={resume} onUpdate={handleResumeUpdate} />
        </div>

        <Separator orientation="vertical" />

        <div className="w-1/2">
          <ResumePDFPreviewLoadingWrapper resume={debouncedResume as TResume} />
        </div>
      </div>
    </div>
  );
};

export default ResumeDetails;
