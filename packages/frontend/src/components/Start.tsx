import { useReadDashboardAnalytics } from '@/hooks/useReadDashboardAnalytics';
import { useReadUser } from '@/hooks/useReadUser';
import CustomIcon, { IconName } from '@/icons/CustomIcon';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationStageAnalyticsDonutChart } from './analytics/ApplicationStageAnalyticsDonutChart';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import CompanyLogo from './ui/company-logo';
import useDocumentTitle from '@/hooks/useDocumentTitle';

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
			'flex flex-col items-center gap-4 p-4',
			'h-32 rounded-lg border border-border',
			'shadow-sm hover:shadow-md'
		)}
		onClick={onClick}
	>
		<CustomIcon name={icon} className="w-16 h-16" />
		<div className="text-base font-semibold">{title}</div>
	</div>
);

const DataPartnerCard = ({ domain, name }: { domain: string; name: string }) => (
	<div className="flex flex-col items-center justify-center p-4 bg-card ">
		<div className="w-24 h-24 mb-2 flex items-center justify-center">
			<CompanyLogo height={48} width={48} domain={domain} />
		</div>
		<span className="text-sm text-muted-foreground">{name}</span>
	</div>
);

const LoadingSkeleton = () => (
	<div className="space-y-8">
		<Skeleton className="h-12 w-64" />
		<Skeleton className="h-40" />
		<div className="grid grid-cols-12 gap-6">
			<div className="col-span-12 lg:col-span-4">
				<div className="space-y-4">
					<Skeleton className="h-32" />
					<Skeleton className="h-32" />
				</div>
			</div>
			<Skeleton className="h-[400px] lg:col-span-8" />
		</div>
	</div>
);

const Start = () => {
	const navigate = useNavigate();
	const { data: analytics, isLoading } = useReadDashboardAnalytics();
	const { data: user } = useReadUser();
	const userName = user?.fullName ?? 'User';
	useDocumentTitle(``);

	const totalApplications = useMemo(() => {
		if (!analytics) return 0;
		return analytics.applicationStages.reduce((sum, stage) => sum + stage.value, 0);
	}, [analytics]);

	if (isLoading) {
		return <LoadingSkeleton />;
	}

	const dataPartners = [
		{ name: 'LinkedIn', domain: 'linkedin.com' },
		{ name: 'Indeed', domain: 'indeed.com' },
		{ name: 'Glassdoor', domain: 'glassdoor.com' },
		{ name: 'ZipRecruiter', domain: 'ziprecruiter.com' },
		{ name: 'Monster', domain: 'monster.com' },
		{ name: 'Wellfound', domain: 'wellfound.com' },
	];

	return (
		<div className="container mx-auto p-4 space-y-8">
			<h1 className="text-3xl font-bold">Welcome back, {userName}</h1>

			{/* Data Partners
			<Card>
				<CardHeader>
					<CardTitle className="text-center">
						Our data partners provide fresh jobs on a 10-minute to daily basis from the following
						platforms:
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						{dataPartners.map((partner) => (
							<DataPartnerCard key={partner.name} name={partner.name} domain={partner.domain} />
						))}
					</div>
				</CardContent>
			</Card> */}

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Left Column - Quick Actions */}
				<div className="lg:col-span-4 space-y-4">
					<QuickActionCard
						icon="create"
						title="Create Resume"
						onClick={() => navigate('/resumes')}
					/>
					<QuickActionCard
						icon="todo-list"
						title="View Applications"
						onClick={() => navigate('/applications')}
					/>
				</div>

				{/* Right Column - Application Stages */}
				<Card className="lg:col-span-8">
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
