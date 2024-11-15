import {
	ChartConfig,
	DonutChartContainer,
	DonutChartTooltipContent,
} from '@/components/ui/donut-chart';
import { useReadDashboardAnalytics } from '@/hooks/useReadDashboardAnalytics';
import { useReadUser } from '@/hooks/useReadUser';
import CustomIcon, { IconName } from '@/icons/CustomIcon';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cell, Label, Pie, PieChart, Tooltip } from 'recharts';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

const stageColors = {
	not_applied: 'hsl(240 4.8% 95.9%)',
	applied: 'hsl(221 83% 53%)',
	interview: 'hsl(48 96% 53%)',
	success: 'hsl(142 72% 29%)',
	rejected: 'hsl(0 84% 60%)',
} as const;

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
			'bg-card hover:scale-[1.02]',
			'flex flex-col items-center gap-6 p-8',
			'h-56 rounded-lg border border-border',
			'shadow-sm hover:shadow-md'
		)}
		onClick={onClick}
	>
		<CustomIcon name={icon} className="w-48 h-48" />
		<div>
			<Button variant="ghost" size="sm">
				{title}
			</Button>
		</div>
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

	const chartConfig = {
		not_applied: {
			label: 'Not Applied',
			color: stageColors.not_applied,
		},
		applied: {
			label: 'Applied',
			color: stageColors.applied,
		},
		interview: {
			label: 'Interview',
			color: stageColors.interview,
		},
		success: {
			label: 'Success',
			color: stageColors.success,
		},
		rejected: {
			label: 'Rejected',
			color: stageColors.rejected,
		},
	} satisfies ChartConfig;

	if (isLoading) {
		return <LoadingSkeleton />;
	}

	return (
		<div className="container mx-auto p-8 space-y-8">
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
					<CardHeader className="bg-card">
						<CardTitle>Application Stages</CardTitle>
					</CardHeader>
					<CardContent>
						<DonutChartContainer
							config={chartConfig}
							className="mx-auto aspect-square max-h-[300px]"
						>
							<PieChart>
								<Pie
									data={analytics?.applicationStages}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={80}
									paddingAngle={2}
								>
									{analytics?.applicationStages.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={stageColors[entry.name as keyof typeof stageColors]}
										/>
									))}
									<Label
										content={({ viewBox }) => {
											if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
												return (
													<text
														x={viewBox.cx}
														y={viewBox.cy}
														textAnchor="middle"
														dominantBaseline="middle"
													>
														<tspan
															x={viewBox.cx}
															y={viewBox.cy}
															className="fill-foreground text-3xl font-bold"
														>
															{totalApplications}
														</tspan>
														<tspan
															x={viewBox.cx}
															y={(viewBox.cy || 0) + 24}
															className="fill-muted-foreground"
														>
															Applications
														</tspan>
													</text>
												);
											}
										}}
									/>
								</Pie>
								<Tooltip content={<DonutChartTooltipContent />} />
							</PieChart>
						</DonutChartContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Start;
