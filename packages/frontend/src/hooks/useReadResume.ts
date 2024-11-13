import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosConfig';
import { TResumeWithMatches } from '@redundant/common';

const fetchResume = async (id: string): Promise<TResumeWithMatches> => {
	const response = await axiosInstance.get(`http://localhost:3000/resume-parser/${id}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
	return response.data;
};

export const useReadResume = (id: string) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['resume', id],
		queryFn: () => fetchResume(id),
	});

	return {
		resume: data,
		isLoading: isLoading,
		error: error,
	};
};
