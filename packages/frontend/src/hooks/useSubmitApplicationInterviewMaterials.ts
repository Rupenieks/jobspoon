import axiosInstance from '@/utils/axiosConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface InterviewMaterialsInput {
	applicationId: string;
	notes: string;
	files?: File[];
}

export const useSubmitApplicationInterviewMaterials = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ applicationId, notes, files }: InterviewMaterialsInput) => {
			const formData = new FormData();
			formData.append('notes', notes);

			if (files && files.length > 0) {
				files.forEach((file) => {
					formData.append('files', file);
				});
			}

			const { data } = await axiosInstance.post(
				`/applications/${applicationId}/interview-materials`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['insights', variables.applicationId, 'interview'],
			});
		},
	});
};
