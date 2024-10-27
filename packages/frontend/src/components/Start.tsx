import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Start: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to VirtueVita</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create Your Resume</h2>
        <p className="mb-4">
          VirtueVita assists you in creating a resume to your liking. You can
          create multiple resumes tailored for different job opportunities.
        </p>
        <Button onClick={() => navigate("/resumes")}>Create Resume</Button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Find Job Matches</h2>
        <p className="mb-4">
          In the "Matches" section, you'll find your resumes and be able to
          search for jobs related to each resume. This personalized approach
          helps you find the most relevant job opportunities.
        </p>
        <Button onClick={() => navigate("/matches")}>View Matches</Button>
      </div>
    </div>
  );
};

export default Start;
