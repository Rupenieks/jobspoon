import useDebouncedValue from "@/hooks/useDebouncedValue";
import { TResume } from "@redundant/common";
import { useState } from "react";
import ResumePDFRenderer from "./ResumePDFRenderer";
import CustomColorRing from "../loaders/ColorRing";

const ResumePDFPreviewLoadingWrapper = ({ resume }: { resume: TResume }) => {
  const debouncedResume = useDebouncedValue(resume, 500);

  const [isPDFLoading, setIsPDFLoading] = useState(true);

  const handlePDFRenderSuccess = () => {
    setIsPDFLoading(false);
  };

  return (
    <div className="border p-4 h-[297mm] relative">
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
      {debouncedResume && (
        <ResumePDFRenderer
          resume={debouncedResume as TResume}
          onRenderSuccess={handlePDFRenderSuccess}
        />
      )}
    </div>
  );
};

export default ResumePDFPreviewLoadingWrapper;
