import { TResume } from "@redundant/common";
import { useEffect, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

export const App = () => {
  const [resume, setResume] = useState<TResume | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("Resume preview received message:", event.data);
      if (!event.origin.includes("localhost")) return;
      if (event.data.type === "SET_RESUME") {
        console.log("Setting resume data:", event.data.payload);
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
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!resume) return <div>Waiting for resume data...</div>;

  return (
    <div className="h-full w-full bg-gray-100">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={2}
        centerOnInit
        wheel={{ wheelDisabled: false }}
      >
        <TransformComponent>
          <div className="preview bg-white rounded-lg shadow-lg p-8 max-w-[210mm] max-h-[297mm] mx-auto">
            <h1 className="text-3xl font-bold mb-4">{resume.fullName}</h1>
            <p className="text-gray-600 mb-2">{resume.email}</p>
            <p className="text-gray-600 mb-6">{resume.phoneNumber}</p>

            <h2 className="text-2xl font-semibold mb-4">Experience</h2>
            {resume.experience?.map((exp, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold">{exp.company}</h3>
                <p className="text-gray-700 font-medium">{exp.positionTitle}</p>
                <p className="text-gray-600 mb-2">
                  {exp.startDate} - {exp.endDate}
                </p>
                {exp.contributions?.map((contribution, i) => (
                  <p key={i} className="text-gray-700 mb-1">
                    • {contribution}
                  </p>
                ))}
              </div>
            ))}

            <h2 className="text-2xl font-semibold mb-4">Education</h2>
            {resume.education?.map((edu, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold">{edu.university}</h3>
                <p className="text-gray-700">{edu.degree}</p>
                <p className="text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </p>
              </div>
            ))}

            <h2 className="text-2xl font-semibold mb-4">Skills</h2>
            <ul className="list-none grid grid-cols-2 gap-2">
              {resume.skills?.map((skill, index) => (
                <li key={index} className="text-gray-700">
                  • {skill}
                </li>
              ))}
            </ul>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};
