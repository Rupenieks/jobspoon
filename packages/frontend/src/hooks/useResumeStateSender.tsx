import { useCallback, useEffect } from "react";
import type { TResumeData } from "@redundant/common/src";



const useResumeStateSender = ({ resume, iframeRef }: { resume: TResumeData | null, iframeRef: React.RefObject<HTMLIFrameElement> }) => {
  const sendResume = useCallback(() => {
    const message = {
      type: "SET_RESUME",
      payload: resume,
    };
    iframeRef.current?.contentWindow?.postMessage(message, "*");
  }, [resume]);

  const handleResumeRequest = useCallback((event: MessageEvent) => {
    if (event.data.type === "REQUEST_RESUME") {
      sendResume();
    }
  }, [sendResume]);

  useEffect(() => {
    window.addEventListener("message", handleResumeRequest);
    return () => window.removeEventListener("message", handleResumeRequest);
  }, [handleResumeRequest]);

  useEffect(() => {
    sendResume();
  }, [resume, sendResume]);
};

export default useResumeStateSender; 