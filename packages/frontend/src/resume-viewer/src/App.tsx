import { TResume } from "@redundant/common";
import { useEffect, useState } from "react";

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

    console.log("Resume preview mounting, adding message listener");
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!resume) return <div>Waiting for resume data...</div>;

  return (
    <div className="preview">
      <h1>{resume.fullName}</h1>
      <p>{resume.email}</p>
      <p>{resume.phoneNumber}</p>

      <h2>Experience</h2>
      {resume.experience?.map((exp, index) => (
        <div key={index}>
          <h3>{exp.company}</h3>
          <p>{exp.positionTitle}</p>
          <p>
            {exp.startDate} - {exp.endDate}
          </p>
          {exp.contributions?.map((contribution, i) => (
            <p key={i}>• {contribution}</p>
          ))}
        </div>
      ))}

      <h2>Education</h2>
      {resume.education?.map((edu, index) => (
        <div key={index}>
          <h3>{edu.university}</h3>
          <p>{edu.degree}</p>
          <p>
            {edu.startDate} - {edu.endDate}
          </p>
        </div>
      ))}

      <h2>Skills</h2>
      <ul>
        {resume.skills?.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};
