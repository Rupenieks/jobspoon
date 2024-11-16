import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosConfig';
import { toast } from './use-toast';

const matchJobs = async (resumeId: string) => {
	const response = await axiosInstance.post(`/jobs/search/${resumeId}`);
	return response.data;
};

export const useMatchJobs = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: matchJobs,
		onSuccess: (data, resumeId) => {
			if (data.count === 0) {
				toast({
					title: 'No jobs found',
					description:
						'No jobs were found matching your resume. Please update your resume details.',
				});
			} else {
				queryClient.invalidateQueries({ queryKey: ['resumes-with-matches'] });
				queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
				toast({
					title: 'Jobs matched',
				});
			}
		},
	});
};
