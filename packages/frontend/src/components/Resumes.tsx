import React, { useState, useMemo } from "react";
import { useReadResumes } from "@/hooks/useReadResumes";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const Resumes: React.FC = () => {
  const { data: resumes, isLoading, error } = useReadResumes();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      <Card key={resume.id}>
        <CardHeader>
          <CardTitle>{resume.fullName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{resume.positionName}</p>
          <p>{resume.email}</p>
        </CardContent>
      </Card>
    ));
  }, [resumes, isLoading, error]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resumes</h1>
        <div className="flex items-center space-x-4">
          <Tabs
            value={viewMode}
            onValueChange={(value: "grid" | "list") => setViewMode(value)}
          >
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create New</Button>
            </DialogTrigger>
            <DialogContent>
              <h2 className="text-lg font-semibold mb-4">Create New Resume</h2>
              <Tabs defaultValue="upload">
                <TabsList className="mb-4">
                  <TabsTrigger value="upload">Upload PDF</TabsTrigger>
                  <TabsTrigger value="text">Enter Text</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <Input type="file" accept=".pdf" />
                </TabsContent>
                <TabsContent value="text">
                  <Textarea
                    placeholder="Paste your resume text here..."
                    className="h-64"
                  />
                </TabsContent>
              </Tabs>
              <Button className="mt-4">Submit</Button>
            </DialogContent>
          </Dialog>
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
    </div>
  );
};

export default Resumes;
