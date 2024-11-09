import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';
import { useInsightGenerationRequest } from './useInsightGenerationRequest';
import { useReadApplication } from './useReadApplication';

export const usePollingInsights = (applicationId: string | undefined) => {
	const queryClient = useQueryClient();
	const { data: application } = useReadApplication(applicationId);

	const { data: generationRequest } = useInsightGenerationRequest(
		applicationId,
		application?.stage ?? ''
	);

	// Check if we have insights for the current stage
	const hasInsightsForCurrentStage = useMemo(
		() => application?.insights?.some((insight) => insight.stage === application?.stage),
		[application?.insights, application?.stage]
	);
	console.log('application', application);
	console.log('generationRequest', generationRequest);

	// Should poll if:
	// 1. We have an application with a stage
	// 2. We don't have insights for this stage yet
	// 3. We have a generation request in 'STARTED' status
	const shouldPoll = useMemo(
		() =>
			!!application?.stage &&
			!hasInsightsForCurrentStage &&
			generationRequest?.status === 'STARTED',
		[application?.stage, hasInsightsForCurrentStage, generationRequest?.status]
	);

	console.log('shouldPoll', shouldPoll);

	useQuery({
		queryKey: ['insights', applicationId, application?.stage],
		queryFn: async () => {
			const { data } = await axios.get(`/api/insights/application/${applicationId}`);

			if (generationRequest?.status === 'SUCCESS') {
				// Invalidate application query to refresh insights
				queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
			}

			return data;
		},
		refetchInterval: shouldPoll ? 2000 : false,
		enabled: !!applicationId && !!application?.stage,
	});

	return { isLoading: shouldPoll };
};
