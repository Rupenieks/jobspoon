import axiosInstance from '@/utils/axiosConfig';
import { TUpdateUser } from '@redundant/common/src';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useEditUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Omit<TUpdateUser, 'id'>) => {
			const response = await axiosInstance.patch('/users', data);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user'] });
		},
	});
};
