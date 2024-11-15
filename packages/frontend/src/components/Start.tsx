import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	Area,
} from 'recharts';
import CustomIcon, { IconName } from '@/icons/CustomIcon';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useReadDashboardAnalytics } from '@/hooks/useReadDashboardAnalytics';
import { Skeleton } from './ui/skeleton';
import { useMemo } from 'react';
import { format } from 'date-fns';

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
	<Card
		className={cn(
			'cursor-pointer transition-colors',
			'hover:bg-muted/50',
			'flex items-center gap-4 p-4',
			'h-48'
		)}
		onClick={onClick}
	>
		<CustomIcon name={icon} className="w-8 h-8" />
		<div>
			<h3 className="font-semibold">{title}</h3>
		</div>
	</Card>
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

const formatStageName = (stage: string) => {
	return stage
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

const Start = () => {
	const navigate = useNavigate();
	const { data: analytics, isLoading } = useReadDashboardAnalytics();
	const userName = 'John'; // TODO: Get from user context

	const totalApplications = useMemo(() => {
		if (!analytics) return 0;
		return analytics.applicationStages.reduce((sum, stage) => sum + stage.value, 0);
	}, [analytics]);

	if (isLoading) {
		return <LoadingSkeleton />;
	}

	return (
		<div className="container mx-auto p-8 space-y-8">
			<h1 className="text-3xl font-bold">Welcome back, {userName}</h1>

			{/* Quick Actions */}
			<div className="grid grid-cols-2 gap-4">
				<QuickActionCard
					icon="create"
					title="Create Resume"
					onClick={() => navigate('/resumes/new')}
				/>
				<QuickActionCard
					icon="applications"
					title="View Applications"
					onClick={() => navigate('/applications')}
				/>
			</div>

			{/* Analytics */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Application Stages */}
				<Card className="lg:col-span-4">
					<CardHeader>
						<CardTitle>Application Stages</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-[300px] relative">
							<ResponsiveContainer width="100%" height="100%">
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
									</Pie>
									<Tooltip
										contentStyle={{
											backgroundColor: 'hsl(var(--background))',
											border: '1px solid hsl(var(--border))',
											borderRadius: '6px',
											padding: '8px',
										}}
										formatter={(value: number, name: string) => [
											`${value} application${value !== 1 ? 's' : ''}`,
											formatStageName(name),
										]}
										itemStyle={{
											color: 'hsl(var(--foreground))',
											padding: '4px 0',
										}}
										labelStyle={{
											color: 'hsl(var(--foreground))',
											fontWeight: 'bold',
										}}
									/>
								</PieChart>
							</ResponsiveContainer>
							{/* Center text */}
							<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
								<span className="text-3xl font-bold">{totalApplications}</span>
								<span className="text-sm text-muted-foreground">Applications</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Weekly Applications */}
				<Card className="lg:col-span-8">
					<CardHeader>
						<CardTitle>Weekly Applications</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={analytics?.weeklyApplications}>
									<defs>
										<linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="hsl(var(--info) / 0.2)" stopOpacity={0.8} />
											<stop offset="95%" stopColor="hsl(var(--info) / 0.2)" stopOpacity={0} />
										</linearGradient>
									</defs>
									<XAxis
										dataKey="week"
										stroke="hsl(var(--muted-foreground))"
										fontSize={12}
										tickFormatter={(date) => format(new Date(date), 'MMM d')}
									/>
									<YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
									<Tooltip
										contentStyle={{
											backgroundColor: 'hsl(var(--background))',
											border: '1px solid hsl(var(--border))',
										}}
									/>
									{/* Area under the line */}
									<Area
										type="monotone"
										dataKey="applications"
										fillOpacity={1}
										fill="url(#colorApplications)"
									/>
									{/* Line on top */}
									<Line
										type="monotone"
										dataKey="applications"
										stroke="#2563eb"
										strokeWidth={2}
										dot={{
											fill: '#2563eb',
											r: 4,
										}}
										activeDot={{
											r: 6,
											stroke: '#2563eb',
											strokeWidth: 2,
										}}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Start;
