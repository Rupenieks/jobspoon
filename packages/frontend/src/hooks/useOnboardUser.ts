import axiosInstance from '@/utils/axiosConfig';
import { TUpdateUser } from '@redundant/common/src';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useOnboardUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Omit<TUpdateUser, 'id'>) => {
			const response = await axiosInstance.patch('/users/onboarding', data);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user'] });
		},
	});
};
