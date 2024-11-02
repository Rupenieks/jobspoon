import { useState, useCallback } from "react";
import axios from "axios";
import axiosInstance from "@/utils/axiosConfig";

interface UseDownloadPDFProps {
  resumeId?: string;
}

export const useDownloadPDF = ({ resumeId }: UseDownloadPDFProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadPDF = useCallback(async () => {
    if (!resumeId) {
      setError("No resume ID provided");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/pdf/${resumeId}`, {
        responseType: "blob",
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download PDF");
      console.error("Failed to download PDF:", err);
    } finally {
      setIsLoading(false);
    }
  }, [resumeId]);

  return {
    downloadPDF,
    isLoading,
    error,
  };
};
