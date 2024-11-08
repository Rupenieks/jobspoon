import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

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
			const { data } = await axios.patch(`/api/applications/${applicationId}/stage`, { stage });
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['applications'] });
		},
	});
};
