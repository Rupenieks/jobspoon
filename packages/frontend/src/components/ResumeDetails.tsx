import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useReadResume } from "@/hooks/useReadResume";
import { ResumeSkeleton } from "./skeletons/ResumeSkeleton";
import ResumeEditorTabs from "./resumes/ResumeEditorTabs";
import { TResume } from "@redundant/common/src";

const ResumeDetails: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const { data: initialResume, isLoading, error } = useReadResume(resumeId!);
  const [editedResume, setEditedResume] = useState<TResume | null>(null);

  useEffect(() => {
    if (initialResume) {
      setEditedResume(initialResume);
    }
  }, [initialResume]);

  const handleResumeUpdate = useMemo(
    () => (updatedResume: TResume) => {
      setEditedResume(updatedResume);
    },
    []
  );

  if (isLoading) {
    return <ResumeSkeleton />;
  }

  if (error || !editedResume) {
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

      <h1 className="text-2xl font-bold">{editedResume.positionName}</h1>

      <ResumeEditorTabs
        resume={editedResume}
        resumeId={resumeId!}
        onUpdate={handleResumeUpdate}
      />
    </div>
  );
};

export default ResumeDetails;
