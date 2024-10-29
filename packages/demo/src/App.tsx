import { useCallback, useEffect } from "react";
import { useBuilderStore } from "./store";
import html2pdf from "html2pdf.js";

export const App = () => {
  const frameRef = useBuilderStore((state) => state.frame.ref);
  const setFrameRef = useBuilderStore((state) => state.frame.setRef);
  const resume = useBuilderStore((state) => state.resume);
  const updateResume = useBuilderStore((state) => state.updateResume);

  const updateResumeInFrame = useCallback(() => {
    if (!frameRef?.contentWindow) return;
    const message = { type: "SET_RESUME", payload: resume };
    frameRef.contentWindow.postMessage(message, "*");
  }, [frameRef, resume]);

  useEffect(() => {
    if (!frameRef) return;
    frameRef.addEventListener("load", updateResumeInFrame);
    return () => {
      frameRef.removeEventListener("load", updateResumeInFrame);
    };
  }, [frameRef, updateResumeInFrame]);

  useEffect(() => {
    updateResumeInFrame();
  }, [resume, updateResumeInFrame]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateResume({
      basics: { ...resume.basics, name: e.target.value },
    });
  };

  const handleDownloadPDF = useCallback(async () => {
    if (!frameRef?.contentWindow) return;

    // Tell artboard to prepare for PDF
    frameRef.contentWindow.postMessage({ type: "PREPARE_PDF" }, "*");

    // Wait for the artboard to respond with the content
    const response = await new Promise((resolve) => {
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === "PDF_CONTENT") {
          window.removeEventListener("message", handleMessage);
          resolve(event.data.payload);
        }
      };
      window.addEventListener("message", handleMessage);
    });

    // Generate PDF
    const element = document.createElement("div");
    element.innerHTML = response as string;

    const options = {
      margin: 10,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().from(element).set(options).save();
  }, [frameRef]);

  return (
    <div className="app">
      <div className="editor">
        <h2>Resume Editor</h2>
        <input
          type="text"
          value={resume.basics.name}
          onChange={handleNameChange}
          placeholder="Name"
        />
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
        >
          Download PDF
        </button>
      </div>

      <div className="preview">
        <iframe
          ref={setFrameRef}
          title="Resume Preview"
          src="http://localhost:3001"
          style={{ width: "400px", height: "800px", border: "1px solid #ccc" }}
        />
      </div>
    </div>
  );
};
