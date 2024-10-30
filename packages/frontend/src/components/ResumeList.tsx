import React, { useMemo, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReadResumes } from "@/hooks/useReadResumes";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import CreateResumeDialog from "./CreateResumeDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteResumes } from "@/hooks/useDeleteResumes";

const ResumeList: React.FC = () => {
  const { data: resumes, isLoading, error } = useReadResumes();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedResumes, setSelectedResumes] = useState<Set<string>>(
    new Set()
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate: deleteResumes } = useDeleteResumes();

  const handleViewModeChange = useCallback((value: string) => {
    setViewMode(value as "list" | "grid");
  }, []);

  const handleResumeClick = useCallback(
    (resumeId: string) => {
      navigate(`/resumes/${resumeId}`);
    },
    [navigate]
  );

  const handleCheckboxChange = useCallback(
    (resumeId: string, checked: boolean) => {
      setSelectedResumes((prev) => {
        const newSet = new Set(prev);
        if (checked) {
          newSet.add(resumeId);
        } else {
          newSet.delete(resumeId);
        }
        return newSet;
      });
    },
    []
  );

  const handleDeleteClick = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    deleteResumes(Array.from(selectedResumes));
    setSelectedResumes(new Set());
    setIsDeleteDialogOpen(false);
  }, [deleteResumes, selectedResumes]);

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
        className="cursor-pointer hover:shadow-md transition-shadow relative"
      >
        <div className="absolute top-2 right-2 z-10">
          <Checkbox
            checked={selectedResumes.has(resume.id)}
            onCheckedChange={(checked) =>
              handleCheckboxChange(resume.id, checked as boolean)
            }
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div onClick={() => handleResumeClick(resume.id)}>
          <CardHeader>
            <CardTitle>{resume.data.fullName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{resume.data.positionName}</p>
            <p>{resume.data.email}</p>
          </CardContent>
        </div>
      </Card>
    ));
  }, [
    resumes,
    isLoading,
    error,
    handleResumeClick,
    selectedResumes,
    handleCheckboxChange,
  ]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resumes</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDeleteClick}
            disabled={selectedResumes.size === 0}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedResumes.size} selected
              resume
              {selectedResumes.size > 1 ? "s" : ""}. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ResumeList;
