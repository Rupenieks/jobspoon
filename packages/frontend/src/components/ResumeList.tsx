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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteResumes } from "@/hooks/useDeleteResumes";
import { useReadApplications } from "@/hooks/useReadApplications";
import { useReadResumes } from "@/hooks/useReadResumes";
import { formatDistanceToNow } from 'date-fns';
import { Plus, Trash2 } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateResumeDialog from "./CreateResumeDialog";
import { Separator } from "./ui/separator";

const ResumeList: React.FC = () => {
  const { data: resumes, isLoading, error } = useReadResumes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedResumes, setSelectedResumes] = useState<Set<string>>(
    new Set()
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate: deleteResumes } = useDeleteResumes();

  const { data: applications } = useReadApplications();

  const filteredResumes = useMemo(() => {
    return resumes?.filter((resume) => {
      return !applications?.some((application) => application.resumeId === resume.id);
    });
  }, [resumes, applications]);


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
          <Card
            key={index}
            className="relative overflow-hidden"
            style={{
              aspectRatio: '1/1.414', // A4 aspect ratio
            }}
          >
            <div 
              className="h-full p-4 flex flex-col"
              style={{ 
                borderLeft: '8px solid #e5e7eb', // gray-200 color for skeleton
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>

              <div className="mt-auto">
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
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

    return filteredResumes?.map((resume) => (
      <Card
        key={resume.id}
        className="cursor-pointer relative overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
        style={{
          aspectRatio: '1/1.414', // A4 aspect ratio
        }}
      >
        <div className="absolute top-4 right-4 z-10">
          <Checkbox
            className="bg-white data-[state=checked]:bg-white"
            checked={selectedResumes.has(resume.id)}
            onCheckedChange={(checked) =>
              handleCheckboxChange(resume.id, checked as boolean)
            }
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div 
          onClick={() => handleResumeClick(resume.id)}
          className="h-full p-4 flex flex-col"
          style={{ 
            borderLeft: `8px solid ${resume.data.config.sidebarColor}`,
            backgroundColor: resume.data.config.primaryColor,
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {resume.data.profileImage && (
                <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={resume.data.profileImage} 
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <span 
                className="text-lg font-semibold"
                style={{ color: resume.data.config.fontColor }}
              >
                {resume.data.personalInfo?.fullName}
              </span>
            </div>
          </div>

          <span className="mt-6 text-xs text-gray-500">
            {resume.data.personalInfo?.profileBio}
          </span>

          <div className="mt-auto">
            <p 
              className="text-xl font-medium"
              style={{ color: resume.data.config.fontColor }}
            >
              {resume.data.personalInfo?.positionName}
            </p>
            <p 
              className="text-sm text-gray-500 mt-1"
              style={{ color: resume.data.config.fontColor }}
            >
              Created {formatDistanceToNow(new Date(resume.createdAt))} ago
            </p>
          </div>
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
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Resumes</h1>

      <span className="mb-4 text-md text-gray-500">Here you can access the resumes you have created</span>

        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDeleteClick}
            disabled={selectedResumes.size === 0}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <CreateResumeDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          />
        </div>
      </div>
      <Separator className="mb-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>
  );
};

export default ResumeList;
