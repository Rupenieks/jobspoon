import { TResumeBase } from '@redundant/common';
import { useQuery } from '@tanstack/react-query';

import axiosInstance from '@/utils/axiosConfig';

const fetchResumes = async (): Promise<TResumeBase[]> => {
	const response = await axiosInstance.get('http://localhost:3000/resume-parser/all', {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
	return response.data;
};

export const useReadResumes = () => {
	return useQuery({
		queryKey: ['resumes'],
		queryFn: fetchResumes,
	});
};
