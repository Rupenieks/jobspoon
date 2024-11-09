import axiosInstance from '@/utils/axiosConfig';
import { TInsightBase } from '@redundant/common';
import { useQuery } from '@tanstack/react-query';

export const useReadInsights = (applicationId: string | undefined) => {
	return useQuery<TInsightBase[]>({
		queryKey: ['insights', applicationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get(`/insights/application/${applicationId}`);
			return data;
		},
		enabled: !!applicationId,
	});
};
