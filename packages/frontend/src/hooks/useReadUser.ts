import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosConfig';
import { TUser } from '@redundant/common/src';

const fetchUser = async (): Promise<TUser> => {
	const response = await axiosInstance.get('/users');
	return response.data;
};

export const useReadUser = () => {
	return useQuery({
		queryKey: ['user'],
		queryFn: fetchUser,
	});
};
