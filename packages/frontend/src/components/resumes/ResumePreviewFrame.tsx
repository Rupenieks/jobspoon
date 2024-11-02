import { usePDFExport } from "@/hooks/usePDFExport";
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

  const { generatePDF, fontLoaded } = usePDFExport({
    font:
      temporaryResume?.data.config?.font ||
      resume?.data.config?.font ||
      "Roboto",
    filename: `${
      temporaryResume?.data.fullName || resume?.data.fullName || "resume"
    }.pdf`,
  });

  const updateResumeInFrame = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    const message = {
      type: "SET_RESUME",
      payload: temporaryResume?.data || resume?.data,
    };
    iframeRef.current.contentWindow.postMessage(message, "*");
  }, [resume, temporaryResume]);

  const handleMessage = useCallback(
    async (event: MessageEvent) => {
      if (!event.origin.includes("localhost")) return;
      if (event.data.type === "PDF_CONTENT" && fontLoaded) {
        try {
          await generatePDF(event.data.payload);
        } catch (error) {
          console.error("Failed to generate PDF:", error);
        }
      }
    },
    [generatePDF, fontLoaded]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

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

  const handleDownloadPDF = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({ type: "PREPARE_PDF" }, "*");
  }, []);

  return (
    <div className="relative w-full h-full border border-gray-200 rounded-md">
      <div className="absolute top-4 right-4 z-50">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleDownloadPDF}
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
        src="http://localhost:3001"
        className="w-full h-full border border-gray-200 rounded-md"
      />
    </div>
  );
};

export default ResumePreviewFrame;
