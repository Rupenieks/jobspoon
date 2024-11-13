import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosConfig';
import { useToast } from './use-toast';
import { TResumeBase, TResumeUpdateDTO } from '@redundant/common/src';

const updateResume = async ({ id, resume }: { id: string; resume: TResumeUpdateDTO }) => {
	const response = await axiosInstance.put(`/resume-parser/${id}`, resume);
	return response.data;
};

export const useUpdateResume = () => {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateResume,
		onSuccess: (resume: TResumeBase) => {
			queryClient.invalidateQueries({ queryKey: ['resume', resume.id] });
			toast({
				title: 'Resume updated',
			});
		},
	});
};
