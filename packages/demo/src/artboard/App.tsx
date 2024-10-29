import { useEffect } from "react";
import { useArtboardStore } from "./store";

export const App = () => {
  const resume = useArtboardStore((state) => state.resume);
  const setResume = useArtboardStore((state) => state.setResume);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("Artboard received message:", event.data);
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
          "*",
        );
      }
    };

    console.log("Artboard mounting, adding message listener");
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setResume]);

  console.log("Artboard current resume state:", resume);

  if (!resume) return <div>Waiting for resume data...</div>;

  return (
    <div className="preview">
      <h1>{resume.basics.name}</h1>
      <p>{resume.basics.email}</p>
      <p>{resume.basics.phone}</p>

      <h2>Experience</h2>
      {resume.sections.experience.items.map((item) => (
        <div key={item.id}>
          <h3>{item.company}</h3>
          <p>{item.position}</p>
          <p>{item.date}</p>
        </div>
      ))}
    </div>
  );
};
