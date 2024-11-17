import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosConfig';
import { TApplicationWithMatch } from '@redundant/common';

export const useReadApplications = () => {
	return useQuery<TApplicationWithMatch[], Error>({
		queryKey: ['applications'],
		queryFn: async () => {
			const response = await axiosInstance.get<TApplicationWithMatch[]>('/applications');
			return response.data;
		},
		staleTime: 5 * 60 * 1000,
	});
};
