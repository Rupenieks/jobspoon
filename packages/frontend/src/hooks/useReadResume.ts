import { TResume } from "@redundant/common";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosConfig";

const fetchResume = async (id: string): Promise<TResume> => {
  const response = await axiosInstance.get(
    `http://localhost:3000/resume-parser/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

export const useReadResume = (id: string) => {
  return useQuery({
    queryKey: ["resume", id],
    queryFn: () => fetchResume(id),
  });
};
