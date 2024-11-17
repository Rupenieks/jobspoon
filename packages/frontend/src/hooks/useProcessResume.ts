import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance from '@/utils/axiosConfig';

const processResume = async (input: { type: 'file' | 'text'; content: File | string }) => {
	const formData = new FormData();
	if (input.type === 'file') {
		formData.append('file', input.content as File);
	} else {
		formData.append('text', input.content as string);
	}

	const response = await axiosInstance.post('/resume-parser/process', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return response.data;
};

export const useProcessResume = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: processResume,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['resumes'] });
		},
	});
};
