import axiosInstance from '@/utils/axiosConfig';
import { TResumesWithRunsRemaining } from '@redundant/common';
import { useQuery } from '@tanstack/react-query';

export const useReadResumesWithMatches = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['resumes-with-matches'],
		queryFn: async () => {
			const { data } = await axiosInstance.get<TResumesWithRunsRemaining>('/resume-parser/matches');
			return data;
		},
	});

	return {
		resumes: data?.resumes,
		jobRunsRemaining: data?.jobRunsRemaining,
		isLoading,
		error,
	};
};
