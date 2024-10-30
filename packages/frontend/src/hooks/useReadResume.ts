import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosConfig";
import { TResumeModel } from "@redundant/common";

const fetchResume = async (id: string): Promise<TResumeModel> => {
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
