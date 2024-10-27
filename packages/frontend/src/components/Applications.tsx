import React from "react";
import { useReadApplications } from "@/hooks/useReadApplications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Applications: React.FC = () => {
  const { data: applications, isLoading, error } = useReadApplications();

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  if (error) {
    return <div>Error loading applications</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Applications</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications?.map((application) => (
          <Card key={application.id}>
            <CardHeader>
              <CardTitle>{application.match.positionTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{application.match.companyName}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Applications;
