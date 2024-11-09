import axiosInstance from '@/utils/axiosConfig';
import { useQuery } from '@tanstack/react-query';

export const useInsightGenerationRequest = (applicationId: string | undefined, stage: string) => {
	return useQuery({
		queryKey: ['insightGenerationRequest', applicationId, stage],
		queryFn: async () => {
			const { data } = await axiosInstance.get(
				`/insights/application/${applicationId}/generation-request?stage=${stage}`
			);
			return data;
		},
		enabled: !!applicationId && !!stage,
		staleTime: 0,
	});
};
