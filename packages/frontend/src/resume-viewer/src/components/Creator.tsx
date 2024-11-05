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
    <div className="h-full w-full bg-gray-100 overflow-hidden">
      <TransformWrapper
        initialScale={0.4}
        minScale={0.2}
        maxScale={3}
        centerOnInit={false}
        limitToBounds={false}
        wheel={{ 
          wheelDisabled: false, 
          smoothStep: 0.001,  
          step: 0.02 
        }}
        panning={{ disabled: false, velocityDisabled: false }}
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
        >
          <div 
            className="flex gap-8"
            style={{
              minWidth: `${210 * resume.pages.length + (resume.pages.length - 1) * 32}mm`,
              minHeight: "297mm",
            }}
          >
            {resume.pages.map((_, index) => (
              <div 
                key={index}
                className="preview bg-white rounded-lg w-[210mm] h-[297mm] relative shadow-lg"
              >
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
