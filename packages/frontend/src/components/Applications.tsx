import React, { useMemo, useState, useCallback } from "react";
import { useReadApplications } from "@/hooks/useReadApplications";
import ApplicationCard from "./ApplicationCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import { useDeleteApplications } from "@/hooks/useDeleteApplications";

const Applications: React.FC = () => {
  const { data: applications, isLoading, error } = useReadApplications();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(
    new Set()
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteApplications } = useDeleteApplications();

  const handleViewModeChange = useCallback((value: string) => {
    setViewMode(value as "grid" | "list");
  }, []);

  const handleCheckboxChange = useCallback(
    (applicationId: string, checked: boolean) => {
      setSelectedApplications((prev) => {
        const newSet = new Set(prev);
        if (checked) {
          newSet.add(applicationId);
        } else {
          newSet.delete(applicationId);
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
    deleteApplications(Array.from(selectedApplications));
    setSelectedApplications(new Set());
    setIsDeleteDialogOpen(false);
  }, [deleteApplications, selectedApplications]);

  const ApplicationCards = useMemo(() => {
    if (isLoading) {
      return Array(6)
        .fill(0)
        .map((_, index) => <ApplicationCard key={index} isLoading={true} />);
    }

    if (error) {
      return (
        <div className="col-span-full text-center text-red-500">
          Error loading applications. Please try again later.
        </div>
      );
    }

    return applications?.map((application) => (
      <ApplicationCard
        key={application.id}
        application={application}
        isSelected={selectedApplications.has(application.id)}
        onCheckboxChange={handleCheckboxChange}
      />
    ));
  }, [
    applications,
    isLoading,
    error,
    selectedApplications,
    handleCheckboxChange,
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Applications</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDeleteClick}
            disabled={selectedApplications.size === 0}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Tabs value={viewMode} onValueChange={handleViewModeChange}>
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
        }
      >
        {ApplicationCards}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedApplications.size} selected
              application{selectedApplications.size > 1 ? "s" : ""}. This action
              cannot be undone.
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

export default Applications;
