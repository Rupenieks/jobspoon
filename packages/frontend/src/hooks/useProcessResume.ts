import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const processResume = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "http://localhost:3000/process-resume",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const useProcessResume = () => {
  return useMutation({
    mutationFn: processResume,
  });
};
