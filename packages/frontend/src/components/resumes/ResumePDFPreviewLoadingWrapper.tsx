import useDebouncedValue from "@/hooks/useDebouncedValue";
import { TResume } from "@redundant/common";
import { useEffect, useState } from "react";
import ResumePDFRenderer from "./ResumePDFRenderer";
import CustomColorRing from "../loaders/ColorRing";

const ResumePDFPreviewLoadingWrapper = ({ resume }: { resume: TResume }) => {
  const debouncedResume = useDebouncedValue(resume, 500);

  useEffect(() => {
    setIsPDFLoading(true);
  }, [resume]);

  const [isPDFLoading, setIsPDFLoading] = useState(true);

  const handlePDFRenderSuccess = () => {
    setIsPDFLoading(false);
  };

  const LoadingState = ({ children }: { children?: React.ReactNode }) => (
    <div className="border p-4 h-[297mm] relative w-full">
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-300 ${
          isPDFLoading || !debouncedResume
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
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

  if (!debouncedResume) {
    return <LoadingState />;
  }

  return (
    <LoadingState>
      <ResumePDFRenderer
        resume={debouncedResume as TResume}
        onRenderSuccess={handlePDFRenderSuccess}
      />
    </LoadingState>
  );
};

export default ResumePDFPreviewLoadingWrapper;
