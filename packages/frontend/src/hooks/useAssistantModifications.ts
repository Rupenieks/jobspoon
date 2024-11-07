import axiosInstance from "@/utils/axiosConfig";
import { TResumeBase } from "@redundant/common";
import { useMutation } from "@tanstack/react-query";

const modifyResume = async ({
  resumeId,
  input,
  includeJobDescription,
}: {
  resumeId: string;
  input: string;
  includeJobDescription: boolean;
}): Promise<TResumeBase> => {
  const response = await axiosInstance.post(`/assistant/modify-resume`, {
    resumeId,
    input,
    includeJobDescription: includeJobDescription ?? false,
  });
  return response.data;
};

export const useAssistantModifications = () => {
  return useMutation({
    mutationFn: modifyResume,
  });
};
