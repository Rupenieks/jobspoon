import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosConfig";
import { useToast } from "./use-toast";

const deleteResumes = async (ids: string[]) => {
  const response = await axiosInstance.delete("/resume-parser", {
    data: { ids },
  });
  return response.data;
};

export const useDeleteResumes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResumes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast({
        title: "Resumes deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete resumes",
        variant: "destructive",
      });
    },
  });
};
