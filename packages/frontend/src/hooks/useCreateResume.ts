import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TResumeBase, TResumeManualCreateDTO } from '@redundant/common';
import axiosInstance from '@/utils/axiosConfig';

export const useCreateResume = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: TResumeManualCreateDTO) => {
			const response = await axiosInstance.post<TResumeBase>('/resume-parser/manual-create', data);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['resumes'] });
		},
	});
};
