import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Document, Page, pdfjs } from "react-pdf";
import { useState, useCallback, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProcessResume } from "@/hooks/useProcessResume";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [processedText, setProcessedText] = useState<string>("");

  const { mutate: processResume, isPending } = useProcessResume();

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        processResume(file, {
          onSuccess: (data) => {
            setProcessedText(data.text);
          },
          onError: (error) => {
            console.error("Error processing resume:", error);
            setProcessedText("Error processing resume");
          },
        });
      }
    },
    [processResume]
  );

  const handleUploadClick = useCallback(() => {
    document.getElementById("fileInput")?.click();
  }, []);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    []
  );

  const ResumeUploader = useMemo(() => {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Upload Resume</h2>
        <Input
          id="fileInput"
          type="file"
          onChange={handleFileUpload}
          accept=".pdf"
          className="hidden"
        />
        <Button onClick={handleUploadClick} disabled={isPending}>
          {isPending ? "Processing..." : "Select File"}
        </Button>
        {selectedFile && (
          <p className="text-sm text-gray-600">
            Selected file: {selectedFile.name}
          </p>
        )}
      </div>
    );
  }, [handleFileUpload, handleUploadClick, isPending, selectedFile]);

  const ResumeViewer = useMemo(() => {
    return (
      <div className="mt-8 flex gap-8">
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">PDF Viewer</h2>
          <div className="bg-gray-100 h-[calc(100vh-16rem)] overflow-auto">
            {selectedFile ? (
              <Document
                file={selectedFile}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex flex-col items-center"
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={400}
                    className="mb-4"
                  />
                ))}
              </Document>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Upload a PDF to view it here</p>
              </div>
            )}
          </div>
        </div>
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">Processed Text</h2>
          <div className="bg-gray-100 h-[calc(100vh-16rem)] overflow-auto p-4">
            <pre>{processedText}</pre>
          </div>
        </div>
      </div>
    );
  }, [selectedFile, numPages, onDocumentLoadSuccess, processedText]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen">
        {/* Top Navbar */}
        <nav className="bg-gray-800 text-white p-4">
          <h1 className="text-xl font-bold">Resume Dashboard</h1>
        </nav>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidepanel */}
          <aside className="w-64 bg-gray-100 p-4">
            <h2 className="text-lg font-semibold mb-4">Sidepanel</h2>
            {/* List will be added here later */}
          </aside>

          {/* Main content area */}
          <main className="flex-1 p-8 overflow-auto">
            {ResumeUploader}
            {ResumeViewer}
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;
