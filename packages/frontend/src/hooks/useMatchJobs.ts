import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosConfig";
import { toast } from "./use-toast";

const matchJobs = async (resumeId: string) => {
  const response = await axiosInstance.post(`/jobs/search/${resumeId}`);
  return response.data;
};

export const useMatchJobs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchJobs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast({
        title: "Jobs matched",
      });
    },
  });
};
