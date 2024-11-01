import { useQuery } from "@tanstack/react-query";
import { TMatchWithApplication } from "@redundant/common";
import axiosInstance from "@/utils/axiosConfig";

export const useGetMatches = (resumeId: string | undefined) => {
  return useQuery<TMatchWithApplication[]>({
    queryKey: ["matches", resumeId],
    queryFn: async () => {
      if (!resumeId) throw new Error("Resume ID is required");
      const { data } = await axiosInstance.get(`/matches/resume/${resumeId}`);
      return data;
    },
    enabled: !!resumeId,
  });
};
