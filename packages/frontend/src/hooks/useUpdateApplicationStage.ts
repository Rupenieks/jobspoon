import axiosInstance from '@/utils/axiosConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateApplicationStage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			applicationId,
			stage,
		}: {
			applicationId: string;
			stage: 'not_applied' | 'applied' | 'interview' | 'rejected' | 'success';
		}) => {
			const { data } = await axiosInstance.patch(`/applications/${applicationId}/stage`, { stage });
			return data;
		},
		onSuccess: (_, { applicationId }) => {
			console.log('Invalidating application', applicationId);
			queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
			queryClient.invalidateQueries({ queryKey: ['applications'] });
		},
	});
};
