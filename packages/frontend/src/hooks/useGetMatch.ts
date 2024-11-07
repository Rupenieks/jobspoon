import axiosInstance from "@/utils/axiosConfig";
import { TMatchBase } from "@redundant/common";
import { useQuery } from "@tanstack/react-query";

export const useGetMatch = (id: string | undefined) => {
  const {
    data: match,
    isPending,
    error,
  } = useQuery<TMatchBase>({
    queryKey: ["match", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/matches/${id}`);
      return data;
    },
    enabled: !!id,
  });

  return { match, isPending, error };
};
