import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosConfig";
import { useToast } from "./use-toast";

const deleteApplications = async (ids: string[]) => {
  const response = await axiosInstance.delete("/applications", {
    data: { ids },
  });
  return response.data;
};

export const useDeleteApplications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast({
        title: "Applications deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete applications",
        variant: "destructive",
      });
    },
  });
};
