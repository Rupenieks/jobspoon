import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { TApplication } from "@redundant/common";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  application?: TApplication;
  isLoading?: boolean;
  isSelected?: boolean;
  onCheckboxChange?: (applicationId: string, checked: boolean) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  isLoading,
  isSelected,
  onCheckboxChange,
}) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (!isLoading && application) {
      navigate(`/applications/${application.id}`);
    }
  }, [navigate, application, isLoading]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!application) return null;

  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow relative",
        "transform hover:scale-105 transition-transform duration-200"
      )}
    >
      <div className="absolute top-2 right-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) =>
            onCheckboxChange?.(application.id, checked as boolean)
          }
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div onClick={handleClick}>
        <CardHeader>
          <CardTitle>{application.match.positionTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{application.match.companyName}</p>
          <p className="text-sm text-gray-500 mt-2">
            {application.match.city}, {application.match.country}
          </p>
        </CardContent>
      </div>
    </Card>
  );
};

export default ApplicationCard;
