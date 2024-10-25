import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Document, Page, pdfjs } from "react-pdf";
import { useState, useCallback, useMemo } from "react";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [numPages, setNumPages] = React.useState<number | null>(null);

  const handleFileUpload = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
      }
    },
    []
  );

  const handleUploadClick = React.useCallback(() => {
    document.getElementById("fileInput")?.click();
  }, []);

  const onDocumentLoadSuccess = React.useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    []
  );

  const ResumeUploader = React.useMemo(() => {
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
        <Button onClick={handleUploadClick}>Select File</Button>
        {selectedFile && (
          <p className="text-sm text-gray-600">
            Selected file: {selectedFile.name}
          </p>
        )}
      </div>
    );
  }, [handleFileUpload, handleUploadClick, selectedFile]);

  const ResumeViewer = React.useMemo(() => {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Resume Viewer</h2>
        <div className="bg-gray-100 h-[calc(100vh-12rem)] w-3/4 mx-auto overflow-auto">
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
                  width={500}
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
    );
  }, [selectedFile, numPages, onDocumentLoadSuccess]);

  return (
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
  );
};

export default App;
