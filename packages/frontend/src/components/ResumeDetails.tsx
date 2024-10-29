import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import ResumeEditingWrapper from "./resumes/ResumeEditingWrapper";
import { useResumeState } from "./resumes/ResumeStateContext";
import { withResumeState } from "./resumes/withResumeState";
import { ResumeSkeleton } from "./skeletons/ResumeSkeleton";

const ResumeDetails: React.FC = () => {
  const navigate = useNavigate();
  const { resume, isLoading, error } = useResumeState();

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

      <ResumeEditingWrapper />
    </div>
  );
};

export default withResumeState(ResumeDetails);
