import React, { useMemo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateApplication } from "@/hooks/useCreateApplication";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import {
  ExternalLink,
  Building2,
  Globe,
  MapPin,
  Briefcase,
} from "lucide-react";
import { useGetMatch } from "@/hooks/useGetMatch";

interface ResumeMatchJobCardProps {
  matchId: string;
  resumeId: string;
}

const MAX_DESCRIPTION_LENGTH = 200;
const MAX_COMPANY_DESCRIPTION_LENGTH = 150;

const ResumeMatchJobCard: React.FC<ResumeMatchJobCardProps> = ({
  matchId,
  resumeId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompanyExpanded, setIsCompanyExpanded] = useState(false);
  const { mutate: createApplication } = useCreateApplication();
  const navigate = useNavigate();
  const { match } = useGetMatch(matchId);

  console.log(match);

  const truncatedDescription = useMemo(() => {
    if (
      !match?.description ||
      match.description.length <= MAX_DESCRIPTION_LENGTH
    ) {
      return match?.description;
    }
    return isExpanded
      ? match.description
      : `${match?.description.slice(0, MAX_DESCRIPTION_LENGTH)}...`;
  }, [match?.description, isExpanded]);

  const truncatedCompanyDescription = useMemo(() => {
    if (
      !match?.longDescription ||
      match?.longDescription.length <= MAX_COMPANY_DESCRIPTION_LENGTH
    ) {
      return match?.longDescription;
    }
    return isCompanyExpanded
      ? match.longDescription
      : `${match?.longDescription.slice(0, MAX_COMPANY_DESCRIPTION_LENGTH)}...`;
  }, [match?.longDescription, isCompanyExpanded]);
  const postedDate = useMemo(() => {
    if (!match?.createdAt) return "";
    return formatDistanceToNow(new Date(match.createdAt), { addSuffix: true });
  }, [match?.createdAt]);

  const handleCreateApplication = useCallback(() => {
    if (!match?.id) return;
    createApplication({ resumeId, matchId: match.id });
    toast({
      title: "Application created",
    });
  }, [createApplication, resumeId, match?.id]);

  const handleGoToApplication = useCallback(() => {
    navigate(`/applications/${match?.application?.id}`);
  }, [navigate, match?.application?.id]);

  const toggleDescription = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const toggleCompanyDescription = useCallback(() => {
    setIsCompanyExpanded((prev) => !prev);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{match?.positionTitle}</h3>
          <span className="text-sm text-gray-500">{postedDate}</span>
        </div>

        {/* Company Info */}
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="h-4 w-4" />
            <span>{match?.companyName}</span>
            {match?.domain && (
              <span className="text-gray-400">({match?.domain})</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>
              {match?.city}, {match?.country}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="h-4 w-4" />
            <span>{match?.seniority}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Company Description */}
      {match?.longDescription && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">About Company</h4>
          <p className="text-sm text-gray-600">{truncatedCompanyDescription}</p>
          {match?.longDescription.length > MAX_COMPANY_DESCRIPTION_LENGTH && (
            <Button
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={toggleCompanyDescription}
            >
              {isCompanyExpanded ? "See less" : "See more"}
            </Button>
          )}
        </div>
      )}

      {/* Job Description */}
      {match?.description && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Job Description</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {truncatedDescription}
          </p>
          {match?.description.length > MAX_DESCRIPTION_LENGTH && (
            <Button
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={toggleDescription}
            >
              {isExpanded ? "See less" : "See more"}
            </Button>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          {match?.companyUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                match?.companyUrl && window.open(match?.companyUrl, "_blank")
              }
              className="text-sm"
            >
              <Globe className="h-4 w-4 mr-2" />
              Company Website
            </Button>
          )}
          {match?.applyUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                match?.applyUrl && window.open(match?.applyUrl, "_blank")
              }
              className="text-sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Apply Directly
            </Button>
          )}
        </div>

        <div>
          {!match?.application ? (
            <Button onClick={handleCreateApplication}>
              Create Application
            </Button>
          ) : (
            <Button variant="outline" onClick={handleGoToApplication}>
              Go to Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeMatchJobCard;
