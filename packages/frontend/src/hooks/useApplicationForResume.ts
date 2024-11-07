import axiosInstance from "@/utils/axiosConfig";
import { TApplicationWithMatch } from "@redundant/common/src";
import { useQuery } from "@tanstack/react-query";

export const useApplicationForResume = (resumeId: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["applications", resumeId],
    queryFn: async () => {
      const response = await axiosInstance.get<TApplicationWithMatch>(`/applications/resume/${resumeId}`);
      return response.data;
    },
  });


  return { data, isPending, error };
};
