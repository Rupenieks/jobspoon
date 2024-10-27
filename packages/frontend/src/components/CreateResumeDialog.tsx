import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Document, Page } from "react-pdf";
import { TResume } from "@redundant/common/src";
import { useProcessResume } from "@/hooks/useProcessResume";
import { ColorRing } from "react-loader-spinner";
import CustomColorRing from "./loaders/ColorRing";

interface CreateResumeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateResumeDialog: React.FC<CreateResumeDialogProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const { mutate: processResume, isPending } = useProcessResume();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [resumeText, setResumeText] = useState<string>("");

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
      processResume(
        { type: "file", content: selectedFile },
        {
          onSuccess: (data: TResume) => {
            console.log("Successfully processed resume:", data);
            onOpenChange(false);
            setSelectedFile(null);
          },
          onError: (error) => {
            console.error("Error processing resume:", error);
          },
        }
      );
    } else if (resumeText) {
      processResume(
        { type: "text", content: resumeText },
        {
          onSuccess: (data: TResume) => {
            console.log("Successfully processed resume:", data);
            onOpenChange(false);
            setResumeText("");
          },
          onError: (error) => {
            console.error("Error processing resume:", error);
          },
        }
      );
    }
  }, [selectedFile, resumeText, processResume, onOpenChange]);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    []
  );

  const colorRingColors = useMemo(
    () => ["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"],
    []
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Create New</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-3xl">
        <h2 className="text-lg font-semibold mb-4">Create New Resume</h2>
        {isPending ? (
          <div className="flex justify-center items-center h-[400px]">
            <CustomColorRing
              colors={
                colorRingColors as [string, string, string, string, string]
              }
            />
          </div>
        ) : (
          <>
            <Tabs defaultValue="upload">
              <TabsList className="mb-4">
                <TabsTrigger value="upload">Upload PDF</TabsTrigger>
                <TabsTrigger value="text">Enter Text</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="h-[400px] overflow-y-auto">
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
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </TabsContent>
            </Tabs>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleProcessResume}
                disabled={(!selectedFile && !resumeText) || isPending}
              >
                Submit
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateResumeDialog;
