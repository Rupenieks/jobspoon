import { useReadDashboardAnalytics } from '@/hooks/useReadDashboardAnalytics';
import { useReadUser } from '@/hooks/useReadUser';
import CustomIcon, { IconName } from '@/icons/CustomIcon';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationStageAnalyticsDonutChart } from './analytics/ApplicationStageAnalyticsDonutChart';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

const QuickActionCard = ({
	icon,
	title,
	onClick,
}: {
	icon: IconName;
	title: string;
	onClick: () => void;
}) => (
	<div
		className={cn(
			'cursor-pointer transition-all duration-200',
			'bg-card hover:scale-[1.02] hover:bg-muted',
			'flex flex-col items-center gap-6 p-8',
			'h-56 rounded-lg border border-border',
			'shadow-sm hover:shadow-md'
		)}
		onClick={onClick}
	>
		<CustomIcon name={icon} className="w-48 h-48" />
		<div className="text-lg font-semibold">{title}</div>
	</div>
);

const LoadingSkeleton = () => (
	<div className="space-y-8">
		<Skeleton className="h-12 w-64" />
		<div className="grid grid-cols-2 gap-4">
			<Skeleton className="h-20" />
			<Skeleton className="h-20" />
		</div>
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
			<Skeleton className="h-[400px] lg:col-span-4" />
			<Skeleton className="h-[400px] lg:col-span-8" />
		</div>
	</div>
);

const Start = () => {
	const navigate = useNavigate();
	const { data: analytics, isLoading } = useReadDashboardAnalytics();
	const { data: user } = useReadUser();
	const userName = user?.fullName ?? 'User';

	const totalApplications = useMemo(() => {
		if (!analytics) return 0;
		return analytics.applicationStages.reduce((sum, stage) => sum + stage.value, 0);
	}, [analytics]);

	if (isLoading) {
		return <LoadingSkeleton />;
	}

	return (
		<div className="container mx-auto p-4 space-y-8">
			<h1 className="text-3xl font-bold">Welcome back, {userName}</h1>

			{/* Quick Actions */}
			<div className="grid grid-cols-2 gap-6">
				<QuickActionCard icon="create" title="Create Resume" onClick={() => navigate('/resumes')} />
				<QuickActionCard
					icon="todo-list"
					title="View Applications"
					onClick={() => navigate('/applications')}
				/>
			</div>

			{/* Analytics */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Application Stages */}
				<Card className="lg:col-span-4">
					<CardHeader className="bg-card bg-muted">
						<CardTitle>Application Stages</CardTitle>
					</CardHeader>
					<CardContent>
						<ApplicationStageAnalyticsDonutChart
							data={analytics?.applicationStages}
							totalApplications={totalApplications}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Start;
