import React, { useCallback, useEffect } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import WebFont from "webfontloader";
import useResumeStateReceiver from "../hooks/useResumeStateReceiver";
import { StandardTemplate } from "../templates/StandardTemplate";

const PAGE_HEIGHT = 297; // A4 height in mm

const Creator: React.FC = () => {
  const { resume } = useResumeStateReceiver();

  useEffect(() => {
    if (resume?.config?.font) {
      WebFont.load({
        google: {
          families: [resume.config.font],
        },
      });
    }
  }, [resume?.config?.font]);

  const renderPageDividers = useCallback(() => {
    if (!resume?.pages || resume.pages.length === 1) return null;

    return Array.from({ length: resume.pages.length - 1 }).map((_, index) => (
      <div
        key={index}
        className="absolute w-full border-b-2 border-black border-dashed pointer-events-none"
        style={{
          top: `${(index + 1) * PAGE_HEIGHT}mm`,
        }}
      />
    ));
  }, [resume?.pages]);

  if (!resume) return <div>Waiting for resume data...</div>;

  return (
    <div className="h-full w-full bg-gray-100">
      <TransformWrapper
        initialScale={0.5}
        minScale={0.5}
        maxScale={3}
        centerOnInit
        centerZoomedOut={false}
        wheel={{ wheelDisabled: false }}
      >
        <TransformComponent>
          <div className="flex gap-8">
          {resume.pages.map((_, index) => (
          <div className="preview bg-white rounded-lg w-[210mm] h-fit mx-auto relative">
              <StandardTemplate resume={resume} pageIndex={index} />
          </div>
            ))}
          </div>


        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Creator;
