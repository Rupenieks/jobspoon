import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TApplicationBase } from "@redundant/common";
import axiosInstance from "@/utils/axiosConfig";

interface CreateApplicationParams {
  resumeId: string;
  matchId: string;
}

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<TApplicationBase, Error, CreateApplicationParams>({
    mutationFn: async ({ resumeId, matchId }) => {
      const response = await axiosInstance.post<TApplicationBase>("/applications", {
        resumeId,
        matchId,
      });
      return response.data;
    },
    onSuccess: (newApplication) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });

      // Optionally, you can update the cache directly
      queryClient.setQueryData<TApplicationBase[]>(["applications"], (oldData) =>
        oldData ? [...oldData, newApplication] : [newApplication]
      );
    },
    onError: (error) => {
      // Handle error (e.g., show a toast notification)
      console.error("Failed to create application:", error);
    },
  });

  return {
    ...mutation,
    mutateAsync: mutation.mutateAsync,
  };
};
