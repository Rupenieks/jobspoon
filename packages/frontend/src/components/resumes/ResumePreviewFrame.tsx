import { useResumeState } from "./ResumeStateContext";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import html2pdf from "html2pdf.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const ResumePreviewFrame = () => {
  const { resume, temporaryResume } = useResumeState();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updateResumeInFrame = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    const message = {
      type: "SET_RESUME",
      payload: temporaryResume?.data || resume?.data,
    };
    iframeRef.current.contentWindow.postMessage(message, "*");
  }, [resume, temporaryResume]);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (!event.origin.includes("localhost")) return;
      if (event.data.type === "PDF_CONTENT") {
        const content = event.data.payload;
        if (content) {
          const filename = `${
            temporaryResume?.data.fullName || resume?.data.fullName || "resume"
          }.pdf`;
          html2pdf()
            .set({
              margin: 10,
              filename,
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .from(content)
            .save();
        }
      }
    },
    [resume, temporaryResume]
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
