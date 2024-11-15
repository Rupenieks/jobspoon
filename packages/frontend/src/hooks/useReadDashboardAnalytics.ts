import axiosInstance from '@/utils/axiosConfig';
import { useQuery } from '@tanstack/react-query';

interface DashboardAnalytics {
	applicationStages: {
		name: string;
		value: number;
	}[];
	weeklyApplications: {
		week: string;
		applications: number;
	}[];
}

export const useReadDashboardAnalytics = () => {
	return useQuery<DashboardAnalytics>({
		queryKey: ['dashboardAnalytics'],
		queryFn: async () => {
			const { data } = await axiosInstance.get('/applications/analytics/dashboard');
			return data;
		},
	});
};
