import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useReadResumes } from "@/hooks/useReadResumes";
import { TResume } from "@redundant/common/src";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import ResumeEditor from "./ResumeEditor";
import { Separator } from "@/components/ui/separator";
import ResumePDFRenderer from "./resumes/ResumePDFRenderer";
import ResumePDFPreviewLoadingWrapper from "./resumes/ResumePDFPreviewLoadingWrapper";

const ResumeDetails: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { data: resumes } = useReadResumes();
  const navigate = useNavigate();

  const initialResume = useMemo(() => {
    return resumes?.find((r) => r.id === resumeId) || null;
  }, [resumes, resumeId]);

  const [editedResume, setEditedResume] = useState<TResume | null>(
    initialResume
  );

  // Debounce the editedResume to reduce the number of re-renders
  const debouncedResume = useDebouncedValue(editedResume, 1000);

  useEffect(() => {
    console.log("Debounced resume changed", debouncedResume);
  }, [debouncedResume]);

  const handleResumeUpdate = useCallback((updatedResume: TResume) => {
    setEditedResume(updatedResume);
  }, []);

  const handleSaveChanges = useCallback(() => {
    // Implement the logic to save the changes to the backend
    console.log("Saving changes:", editedResume);
  }, [editedResume]);

  if (!editedResume) {
    return <div>Resume not found</div>;
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

      <div className="flex gap-6">
        <div className="w-1/2 space-y-8">
          <ResumeEditor resume={editedResume} onUpdate={handleResumeUpdate} />
          <Button onClick={handleSaveChanges}>Save Changes</Button>
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
