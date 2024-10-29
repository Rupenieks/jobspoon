import { useResumeState } from "./ResumeStateContext";
import { useCallback, useEffect, useRef } from "react";

const ResumePreviewFrame = () => {
  const { resume } = useResumeState();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updateResumeInFrame = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    const message = { type: "SET_RESUME", payload: resume };
    iframeRef.current.contentWindow.postMessage(message, "*");
  }, [resume]);

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
    <iframe
      ref={iframeRef}
      title="Resume Preview"
      src="http://localhost:3001"
      className="w-full h-full border border-gray-200 rounded-md"
    />
  );
};

export default ResumePreviewFrame;
