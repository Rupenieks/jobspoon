import React, { useMemo, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReadResumes } from "@/hooks/useReadResumes";
import { useNavigate } from "react-router-dom";
import CreateResumeDialog from "./CreateResumeDialog";

const ResumeList: React.FC = () => {
  const { data: resumes, isLoading, error } = useReadResumes();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewModeChange = useCallback((value: string) => {
    setViewMode(value as "list" | "grid");
  }, []);

  const handleResumeClick = useCallback(
    (resumeId: string) => {
      navigate(`/resumes/${resumeId}`);
    },
    [navigate]
  );

  const ResumeCards = useMemo(() => {
    if (isLoading) {
      return Array(6)
        .fill(0)
        .map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ));
    }

    if (error) {
      return (
        <div className="col-span-full text-center text-red-500">
          Error loading resumes. Please try again later.
        </div>
      );
    }

    return resumes?.map((resume) => (
      <Card
        key={resume.id}
        onClick={() => handleResumeClick(resume.id)}
        className="cursor-pointer hover:shadow-md transition-shadow"
      >
        <CardHeader>
          <CardTitle>{resume.fullName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{resume.positionName}</p>
          <p>{resume.email}</p>
        </CardContent>
      </Card>
    ));
  }, [resumes, isLoading, error, handleResumeClick]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resumes</h1>
        <div className="flex items-center space-x-4">
          <Tabs value={viewMode} onValueChange={handleViewModeChange}>
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
          <CreateResumeDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          />
        </div>
      </div>
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
        }
      >
        {ResumeCards}
      </div>
    </>
  );
};

export default ResumeList;
