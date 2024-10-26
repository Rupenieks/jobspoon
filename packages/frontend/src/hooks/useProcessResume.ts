import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const processResume = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "http://localhost:3000/resume-parser/process",
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: processResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
};
