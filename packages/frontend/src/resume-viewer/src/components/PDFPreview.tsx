import React, { useEffect, useState } from "react";
import type { TResumeData } from "@redundant/common/src";
import { StandardTemplate } from "../templates/StandardTemplate";
import WebFont from "webfontloader";

const PDFPreview: React.FC = () => {
  const [resume, setResume] = useState<TResumeData | null>(null);

  useEffect(() => {
    const resumeData = localStorage.getItem("resume");
    if (resumeData) {
      const parsedResume = JSON.parse(resumeData);
      setResume(parsedResume);
    }
  }, []);

  useEffect(() => {
    if (resume?.config?.font) {
      WebFont.load({
        google: {
          families: [resume.config.font],
        },
      });
    }
  }, [resume?.config?.font]);

  if (!resume) return null;

  return (
    <div className="preview bg-white w-[210mm] min-h-[297mm] h-fit mx-auto">
      <StandardTemplate resume={resume} />
    </div>
  );
};

export default PDFPreview;
