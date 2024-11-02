import React, { useEffect, useState, useCallback } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { StandardTemplate } from "./templates/StandardTemplate";
import type { TResumeData } from "@redundant/common/src";
import WebFont from "webfontloader";

const App: React.FC = () => {
  const [resume, setResume] = useState<TResumeData | null>(null);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (!event.origin.includes("localhost")) return;
    if (event.data.type === "SET_RESUME") {
      setResume(event.data.payload);
    }
    if (event.data.type === "PREPARE_PDF") {
      const previewElement = document.querySelector(".preview");
      if (previewElement) {
        // Clone the element to avoid any React-related issues
        const clonedElement = previewElement.cloneNode(true) as HTMLElement;

        // Make sure all styles are inlined
        const styles = window.getComputedStyle(previewElement);
        clonedElement.style.cssText = styles.cssText;

        // Send the HTML content back to the parent
        window.parent.postMessage(
          {
            type: "PDF_CONTENT",
            payload: clonedElement.outerHTML,
          },
          "*"
        );
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  useEffect(() => {
    if (resume?.config?.font) {
      WebFont.load({
        google: {
          families: [resume.config.font],
        },
      });
    }
  }, [resume?.config?.font]);

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
          <div className="preview bg-white rounded-lg w-[210mm] min-h-[297mm] h-fit mx-auto">
            <StandardTemplate resume={resume} />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default App;
