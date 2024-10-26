import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TResume } from "@redundant/common";

const fetchResumes = async (): Promise<TResume[]> => {
  const response = await axios.get("http://localhost:3000/resume-parser/all", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const useReadResumes = () => {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: fetchResumes,
  });
};
