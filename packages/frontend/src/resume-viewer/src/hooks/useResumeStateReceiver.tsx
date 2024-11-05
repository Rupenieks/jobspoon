import { TResumeData } from "@redundant/common/src";
import { useCallback, useEffect, useState } from "react";

const useResumeStateReceiver = () => {
  const [resume, setResume] = useState<TResumeData | null>(null);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data.type === "SET_RESUME") {
      setResume(event.data.payload);
    }
  }, []);



  useEffect(() => {
    window.addEventListener("message", handleMessage);
    
    window.parent.postMessage({ type: "REQUEST_RESUME" }, "*");


    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);


  return { resume, setResume };
};

export default useResumeStateReceiver;
