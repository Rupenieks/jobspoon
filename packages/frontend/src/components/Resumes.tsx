import React, { useState, useMemo, useCallback } from "react";
import { useReadResumes } from "@/hooks/useReadResumes";
import { useProcessResume } from "@/hooks/useProcessResume";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Document, Page } from "react-pdf";
import { TResume } from "@redundant/common/src";

const Resumes: React.FC = () => {
  const { data: resumes, isLoading, error } = useReadResumes();
  const { mutate: processResume, isPending } = useProcessResume();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
      }
    },
    []
  );

  const handleProcessResume = useCallback(() => {
    if (selectedFile) {
      processResume(selectedFile, {
        onSuccess: (data: TResume) => {
          console.log("Successfully processed resume:", data);
          setIsDialogOpen(false);
          setSelectedFile(null);
        },
        onError: (error) => {
          console.error("Error processing resume:", error);
        },
      });
    }
  }, [selectedFile, processResume]);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    []
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
            <DialogContent className="w-full max-w-3xl">
              <h2 className="text-lg font-semibold mb-4">Create New Resume</h2>
              <Tabs defaultValue="upload">
                <TabsList className="mb-4">
                  <TabsTrigger value="upload">Upload PDF</TabsTrigger>
                  <TabsTrigger value="text">Enter Text</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="upload"
                  className="h-[400px] overflow-y-auto"
                >
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="mb-4"
                  />
                  {selectedFile && (
                    <div className="mt-4">
                      <Document
                        file={selectedFile}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="flex flex-col items-center"
                      >
                        {Array.from(new Array(numPages), (el, index) => (
                          <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={300}
                            className="mb-4"
                          />
                        ))}
                      </Document>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="text" className="h-[400px]">
                  <Textarea
                    placeholder="Paste your resume text here..."
                    className="h-full resize-none"
                  />
                </TabsContent>
              </Tabs>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleProcessResume}
                  disabled={!selectedFile || isPending}
                >
                  {isPending ? "Processing..." : "Submit"}
                </Button>
              </div>
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
