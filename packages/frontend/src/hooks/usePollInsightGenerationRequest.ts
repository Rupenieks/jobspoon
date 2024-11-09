import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosConfig';
import { TInsightGenerationRequest } from '@redundant/common';
import { useMemo } from 'react';

export const usePollInsightGenerationRequest = (
	applicationId: string | undefined,
	stage: string | undefined
) => {
	const queryClient = useQueryClient();
	const { data: generationRequest, ...rest } = useQuery<TInsightGenerationRequest>({
		queryKey: ['insightGenerationRequest', applicationId, stage],
		queryFn: async () => {
			const { data } = await axiosInstance.get(
				`/insights/application/${applicationId}/generation-request?stage=${stage}`
			);

			// If we get a SUCCESS or ERROR status, stop polling and invalidate insights
			if (data?.status === 'SUCCESS' || data?.status === 'ERROR') {
				await queryClient.invalidateQueries({
					queryKey: ['insights', applicationId, stage],
				});
			}

			return data;
		},
		enabled: !!applicationId && !!stage,
		refetchInterval: (data) => (data.state.data?.status === 'STARTED' ? 2000 : false),
		staleTime: 0,
	});

	// isPolling will be true as long as we have a STARTED status
	const isPolling = useMemo(
		() => generationRequest === undefined || generationRequest?.status === 'STARTED',
		[generationRequest, applicationId, stage]
	);

	return {
		generationRequest,
		isPolling,
	};
};
