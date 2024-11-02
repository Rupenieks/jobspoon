import { useCallback, useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import WebFont from "webfontloader";

interface UsePDFExportProps {
  font?: string;
  filename?: string;
}

export const usePDFExport = ({
  font = "Roboto",
  filename = "resume.pdf",
}: UsePDFExportProps) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if (!font) return;

    WebFont.load({
      google: {
        families: [font],
      },
      active: () => setFontLoaded(true),
      inactive: () => {
        console.error("Failed to load font:", font);
        setFontLoaded(true); // Continue with fallback font
      },
    });
  }, [font]);

  const generatePDF = useCallback(
    async (content: string) => {
      if (!fontLoaded) {
        console.warn("Fonts not loaded yet, waiting...");
        return;
      }

      const container = document.createElement("div");
      container.innerHTML = content;
      container.style.width = "210mm";
      container.style.fontFamily = `${font}, sans-serif`;
      document.body.appendChild(container);

      const options = {
        margin: 0,
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true,
          windowWidth: 794,
          windowHeight: 1123,
          onclone: (clonedDoc: Document) => {
            const element = clonedDoc.querySelector(".preview");
            if (element) {
              element.style.fontFamily = `${font}, sans-serif`;
            }
          },
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await html2pdf().from(container).set(options).save();
        document.body.removeChild(container);
      } catch (error) {
        console.error("PDF generation failed:", error);
        document.body.removeChild(container);
        throw error;
      }
    },
    [filename, font, fontLoaded]
  );

  return { generatePDF, fontLoaded };
};
