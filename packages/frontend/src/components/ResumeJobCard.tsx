import React, { useMemo, useCallback } from "react";
import { TApplication, TMatch } from "@redundant/common";
import { Button } from "@/components/ui/button";
import { useCreateApplication } from "@/hooks/useCreateApplication";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ResumeMatchJobCardProps {
  match: TMatch & { application: TApplication };
  resumeId: string;
}

const ResumeMatchJobCard: React.FC<ResumeMatchJobCardProps> = ({
  match,
  resumeId,
}) => {
  const { mutate: createApplication } = useCreateApplication();
  const navigate = useNavigate();

  const handleCreateApplication = useCallback(() => {
    createApplication({ resumeId, matchId: match.id });
  }, [createApplication, resumeId, match.id]);

  const handleGoToApplication = useCallback(() => {
    navigate(`/applications/${match.application?.id}`);
  }, [navigate, match.application?.id]);

  return (
    <li>
      <h3 className="font-semibold text-lg">{match.positionTitle}</h3>
      <p className="text-sm text-gray-600">{match.companyName}</p>
      <p className="text-sm">
        {match.city}, {match.country}
      </p>
      {match.description && <p className="text-sm mt-2">{match.description}</p>}
      <div className="mt-4 flex items-center justify-end">
        {!match.application ? (
          <Button onClick={handleCreateApplication}>Create Application</Button>
        ) : (
          <Button variant="outline" onClick={handleGoToApplication}>
            Go to Application
          </Button>
        )}
      </div>
    </li>
  );
};

export default ResumeMatchJobCard;
