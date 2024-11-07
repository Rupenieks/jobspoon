import axiosInstance from "@/utils/axiosConfig";
import { TApplicationBase, TMatchBase, TResumeBase } from "@redundant/common";
import { useQuery } from "@tanstack/react-query";

export const useReadApplication = (applicationId: string | undefined) => {
  return useQuery<TApplicationBase & { match: TMatchBase; resume: TResumeBase }, Error>({
    queryKey: ["application", applicationId],
    queryFn: async () => {
      if (!applicationId) throw new Error("Application ID is required");
      const response = await axiosInstance.get<TApplicationBase & { match: TMatchBase; resume: TResumeBase }>(
        `/applications/${applicationId}`
      );
      return response.data;
    },
    enabled: !!applicationId,
  });
};
