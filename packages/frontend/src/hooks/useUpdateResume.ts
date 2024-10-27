import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosConfig";
import { TResume } from "@redundant/common";

const updateResume = async ({
  id,
  resume,
}: {
  id: string;
  resume: Omit<TResume, "matches" | "application">;
}) => {
  const response = await axiosInstance.put(`/resume-parser/${id}`, resume);
  return response.data;
};

export const useUpdateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
};
