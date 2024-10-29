import { TResume } from "@redundant/common";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CustomColorRing from "../loaders/ColorRing";
import ResumePDFRenderer from "./ResumePDFRenderer";
import { useResumeState } from "./ResumeStateContext";

const ResumePDFPreviewLoadingWrapper = React.memo(() => {
  const { resume } = useResumeState();

  useEffect(() => {
    setIsPDFLoading(true);
  }, [resume]);

  const [isPDFLoading, setIsPDFLoading] = useState(true);

  const handlePDFRenderSuccess = useCallback(() => {
    setIsPDFLoading(false);
  }, []);

  const LoadingState = useMemo(() => {
    return ({ children }: { children?: React.ReactNode }) => (
      <div className="border p-4 h-[297mm] relative w-full">
        <div
          className={`absolute inset-0 z-10 transition-opacity duration-300 ${
            isPDFLoading ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="w-full h-full flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-sm">
            <CustomColorRing
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </div>
        </div>
        {children}
      </div>
    );
  }, [isPDFLoading, resume]);

  if (!resume) {
    return <LoadingState />;
  }

  return (
    <LoadingState>
      <ResumePDFRenderer
        resume={resume as TResume}
        onRenderSuccess={handlePDFRenderSuccess}
      />
    </LoadingState>
  );
});

export default ResumePDFPreviewLoadingWrapper;
