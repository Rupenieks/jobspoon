import axiosInstance from '@/utils/axiosConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreateResumesForOnboarding = () => {
	const queryClient = useQueryClient();
	const { mutateAsync } = useMutation({
		mutationFn: () => axiosInstance.post('/resume-parser/onboarding-create'),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['resumes'] });
			queryClient.invalidateQueries({ queryKey: ['user'] });
		},
		onError: (error) => {
			console.error('Failed to create resumes:', error);
		},
	});

	return mutateAsync;
};

export default useCreateResumesForOnboarding;
