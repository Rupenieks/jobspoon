import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TApplication } from "@redundant/common";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  application: TApplication;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/applications/${application.id}`);
  }, [navigate, application.id]);

  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow",
        "transform hover:scale-105 transition-transform duration-200"
      )}
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle>{application.match.positionTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{application.match.companyName}</p>
        <p className="text-sm text-gray-500 mt-2">
          {application.match.city}, {application.match.country}
        </p>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
