import React, { useEffect, useMemo } from "react";
import { TResume } from "@redundant/common/src";
import ResumeEditor from "./ResumeEditor";
import ResumePDFPreviewLoadingWrapper from "./resumes/ResumePDFPreviewLoadingWrapper";
import { useUpdateResume } from "@/hooks/useUpdateResume";
import useDebouncedCallback from "@/hooks/useDebouncedCallback";

interface ManualResumeEditorProps {
  resume: TResume;
  resumeId: string;
  onUpdate: (resume: TResume) => void;
}

const ManualResumeEditor: React.FC<ManualResumeEditorProps> = ({
  resume,
  resumeId,
  onUpdate,
}) => {
  const { mutate: updateResume } = useUpdateResume();

  const debouncedSave = useDebouncedCallback(
    (resumeToUpdate: TResume) => {
      const { matches, application, ...resumeData } = resumeToUpdate;
      updateResume({ id: resumeId, resume: resumeData });
    },
    1000,
    [resumeId]
  );

  const handleResumeUpdate = useMemo(
    () => (updatedResume: TResume) => {
      onUpdate(updatedResume);
      debouncedSave(updatedResume);
    },
    [onUpdate, debouncedSave]
  );

  return (
    <div className="flex gap-6">
      <div className="w-1/2">
        <ResumeEditor resume={resume} onUpdate={handleResumeUpdate} />
      </div>
      <div className="w-1/2">
        <ResumePDFPreviewLoadingWrapper resume={resume} />
      </div>
    </div>
  );
};

export default ManualResumeEditor;
