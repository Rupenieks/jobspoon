import React from "react";
import { TMatch } from "@redundant/common";
import { Button } from "@/components/ui/button";
import { useCreateApplication } from "@/hooks/useCreateApplication";

interface ResumeMatchJobCardProps {
  match: TMatch;
  resumeId: string;
}

const ResumeMatchJobCard: React.FC<ResumeMatchJobCardProps> = ({
  match,
  resumeId,
}) => {
  const { mutate: createApplication } = useCreateApplication();
  return (
    <li className="border-b pb-4">
      <h3 className="font-semibold text-lg">{match.positionTitle}</h3>
      <p className="text-sm text-gray-600">{match.companyName}</p>
      <p className="text-sm">
        {match.city}, {match.country}
      </p>
      {match.description && <p className="text-sm mt-2">{match.description}</p>}
      <div className="mt-4 flex  items-center justify-end">
        <Button
          onClick={() => createApplication({ resumeId, matchId: match.id })}
        >
          Create Application
        </Button>
      </div>
    </li>
  );
};

export default ResumeMatchJobCard;
