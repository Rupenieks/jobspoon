import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosConfig";
import { TResume } from "@redundant/common";

const updateResumeImages = async ({
  id,
  profileImage,
  previewImage,
}: {
  id: string;
  profileImage?: File;
  previewImage?: File;
}) => {
  const formData = new FormData();
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }
  if (previewImage !== undefined) {
    formData.append("previewImage", previewImage);
  }

  const response = await axiosInstance.put(
    `/resume-parser/${id}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const useUpdateResumeImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateResumeImages,
    onSuccess: (resume: TResume) => {
      queryClient.invalidateQueries({ queryKey: ["resume", resume.id] });
    },
  });
};
