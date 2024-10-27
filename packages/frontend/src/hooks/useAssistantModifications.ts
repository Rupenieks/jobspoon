import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosConfig";
import { TResume } from "@redundant/common";

const modifyResume = async ({
  resumeId,
  input,
}: {
  resumeId: string;
  input: string;
}): Promise<TResume> => {
  const response = await axiosInstance.post(`/assistant/modify-resume`, {
    resumeId,
    input,
  });
  return response.data;
};

export const useAssistantModifications = () => {
  return useMutation({
    mutationFn: modifyResume,
  });
};
