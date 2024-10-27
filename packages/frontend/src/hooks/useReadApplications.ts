import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosConfig";
import { TApplication } from "@redundant/common";

export const useReadApplications = () => {
  return useQuery<TApplication[], Error>({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await axiosInstance.get<TApplication[]>("/applications");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
