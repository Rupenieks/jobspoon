import { useQuery } from "@tanstack/react-query";
import { TResumeModel } from "@redundant/common";
import axiosInstance from "@/utils/axiosConfig";

export const useReadResumesWithMatches = () => {
  return useQuery<TResumeModel[]>({
    queryKey: ["resumes", "with-matches"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/resume-parser/with-matches");
      return data;
    },
  });
};
