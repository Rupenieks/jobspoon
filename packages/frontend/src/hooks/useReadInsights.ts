import axiosInstance from '@/utils/axiosConfig';
import { TInsightBase } from '@redundant/common';
import { useQuery } from '@tanstack/react-query';

export const useReadInsights = (applicationId: string | undefined, stage: string | undefined) => {
	const query = useQuery<TInsightBase[]>({
		queryKey: ['insights', applicationId, stage],
		queryFn: async () => {
			const { data } = await axiosInstance.get(`/insights/application/${applicationId}`, {
				params: {
					stage,
				},
			});
			return data;
		},
		enabled: !!applicationId,
	});

	return {
		isLoading: query.isLoading,
		insights: query.data ?? null,
	};
};
