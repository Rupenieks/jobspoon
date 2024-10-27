import React from "react";
import { TMatch } from "@redundant/common";

interface ResumeMatchJobCardProps {
  match: TMatch;
}

const ResumeMatchJobCard: React.FC<ResumeMatchJobCardProps> = ({ match }) => {
  return (
    <li className="border-b pb-4">
      <h3 className="font-semibold text-lg">{match.positionTitle}</h3>
      <p className="text-sm text-gray-600">{match.companyName}</p>
      <p className="text-sm">
        {match.city}, {match.country}
      </p>
      {match.description && <p className="text-sm mt-2">{match.description}</p>}
      {match.applyUrl && (
        <a
          href={match.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm mt-2 inline-block"
        >
          Apply Now
        </a>
      )}
    </li>
  );
};

export default ResumeMatchJobCard;
