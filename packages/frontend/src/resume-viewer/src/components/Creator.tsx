import React, { useEffect } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import WebFont from "webfontloader";
import useResumeStateReceiver from "../hooks/useResumeStateReceiver";
import { StandardTemplate } from "../templates/StandardTemplate";

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

export default Creator;
