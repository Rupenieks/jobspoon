import { useCallback, useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "svg2pdf.js";
import html2canvas from "html2canvas";
import WebFont from "webfontloader";

interface UsePDFExportProps {
  font?: string;
  margin?: number;
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
        setFontLoaded(true);
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

      try {
        const doc = new jsPDF({
          unit: "mm",
          format: "a4",
          putOnlyUsedFonts: true,
        });

        const element = container.querySelector(".preview") as HTMLElement;
        if (!element) throw new Error("Preview element not found");

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const elementHeight = element.offsetHeight;
        const scale = pageWidth / element.offsetWidth;
        const totalPages = Math.ceil((elementHeight * scale) / pageHeight);

        for (let i = 0; i < totalPages; i++) {
          if (i > 0) doc.addPage();

          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            windowWidth: element.offsetWidth,
            windowHeight: element.offsetHeight,
            y: i * (pageHeight / scale),
            height: pageHeight / scale,
          });

          const imgData = canvas.toDataURL("image/jpeg", 1.0);

          doc.addImage(
            imgData,
            "JPEG",
            0,
            0,
            pageWidth,
            pageHeight,
            undefined,
            "FAST"
          );

          const textLayer = document.createElement("div");
          textLayer.innerHTML = element.innerHTML;
          const text = textLayer.textContent || "";
          doc.setFontSize(1);
          doc.text(text, -100, -100);
        }

        doc.save(filename);
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
