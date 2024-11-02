import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useResumeState } from "./ResumeStateContext";

const ResumePreviewFrame = () => {
  const { resume, temporaryResume } = useResumeState();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { downloadPDF, isLoading } = useDownloadPDF({
    resumeId: resume?.id,
  });

  const updateResumeInFrame = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    const message = {
      type: "SET_RESUME",
      payload: temporaryResume?.data || resume?.data,
    };
    iframeRef.current.contentWindow.postMessage(message, "*");
  }, [resume, temporaryResume]);

  useEffect(() => {
    if (!iframeRef.current) return;
    iframeRef.current.addEventListener("load", updateResumeInFrame);
    return () => {
      iframeRef.current?.removeEventListener("load", updateResumeInFrame);
    };
  }, [updateResumeInFrame]);

  useEffect(() => {
    updateResumeInFrame();
  }, [resume, updateResumeInFrame]);

  return (
    <div className="relative w-full h-full border border-gray-200 rounded-md">
      <div className="absolute top-4 right-4 z-50">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                onClick={downloadPDF}
                disabled={isLoading || !resume?.id}
                className="bg-white shadow-md hover:bg-gray-100"
              >
                <DownloadIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download PDF</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <iframe
        ref={iframeRef}
        title="Resume Preview"
        src="http://localhost:3001/creator"
        className="w-full h-full border border-gray-200 rounded-md"
      />
    </div>
  );
};

export default ResumePreviewFrame;
