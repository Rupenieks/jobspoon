import React, { useEffect, useState, useCallback } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { StandardTemplate } from "./templates/StandardTemplate";
import type { TResumeData } from "@redundant/common/src";

const App: React.FC = () => {
  const [resume, setResume] = useState<TResumeData | null>(null);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (!event.origin.includes("localhost")) return;
    if (event.data.type === "SET_RESUME") {
      setResume(event.data.payload);
    }
    if (event.data.type === "PREPARE_PDF") {
      const content = document.querySelector(".preview")?.innerHTML;
      window.parent.postMessage(
        {
          type: "PDF_CONTENT",
          payload: content,
        },
        "*"
      );
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  if (!resume) return <div>Waiting for resume data...</div>;

  return (
    <div className="h-full w-full bg-gray-100">
      <TransformWrapper
        initialScale={0.5}
        minScale={0.5}
        maxScale={2}
        centerOnInit
        centerZoomedOut={false}
        wheel={{ wheelDisabled: false }}
      >
        <TransformComponent>
          <div className="preview bg-white rounded-lg p-8 w-[210mm] min-h-[297mm] h-fit mx-auto">
            <StandardTemplate resume={resume} />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default App;
