import React, { useMemo, useCallback } from "react";
import { TApplication, TMatch } from "@redundant/common";
import { Button } from "@/components/ui/button";
import { useCreateApplication } from "@/hooks/useCreateApplication";
import { cn } from "@/lib/utils";

interface ResumeMatchJobCardProps {
  match: TMatch & { application: TApplication };
  resumeId: string;
}

const ResumeMatchJobCard: React.FC<ResumeMatchJobCardProps> = ({
  match,
  resumeId,
}) => {
  const { mutate: createApplication } = useCreateApplication();

  const cardClasses = useMemo(
    () => cn("border-b  pb-4", match.application && "bg-gray-100 opacity-75"),
    [match.application]
  );

  const handleCreateApplication = useCallback(() => {
    createApplication({ resumeId, matchId: match.id });
  }, [createApplication, resumeId, match.id]);

  return (
    <li className={cardClasses}>
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
          <Button disabled>Application already created</Button>
        )}
      </div>
    </li>
  );
};

export default ResumeMatchJobCard;
