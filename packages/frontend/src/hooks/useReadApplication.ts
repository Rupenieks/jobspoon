import { useQuery } from "@tanstack/react-query";
import { TApplication, TMatch, TResume } from "@redundant/common";
import axiosInstance from "@/utils/axiosConfig";

export const useReadApplication = (applicationId: string | undefined) => {
  return useQuery<TApplication & { match: TMatch; resume: TResume }, Error>({
    queryKey: ["application", applicationId],
    queryFn: async () => {
      if (!applicationId) throw new Error("Application ID is required");
      const response = await axiosInstance.get<TApplication>(
        `/applications/${applicationId}`
      );
      return response.data;
    },
    enabled: !!applicationId,
  });
};
