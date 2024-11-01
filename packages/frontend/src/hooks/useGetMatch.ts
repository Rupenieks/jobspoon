import { useQuery } from "@tanstack/react-query";
import { TMatchWithApplication } from "@redundant/common";
import axiosInstance from "@/utils/axiosConfig";

export const useGetMatch = (id: string | undefined) => {
  const {
    data: match,
    isPending,
    error,
  } = useQuery<TMatchWithApplication>({
    queryKey: ["match", id],
    queryFn: async () => {
      if (!id) throw new Error("Match ID is required");
      const { data } = await axiosInstance.get(`/matches/${id}`);
      return data;
    },
    enabled: !!id,
  });

  return { match, isPending, error };
};
