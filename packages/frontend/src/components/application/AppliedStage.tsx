import { Card } from '@/components/ui/card';
import { usePollInsightGenerationRequest } from '@/hooks/usePollInsightGenerationRequest';
import { useReadInsights } from '@/hooks/useReadInsights';
import { cn } from '@/lib/utils';
import { useParams } from 'react-router-dom';
import CustomIcon from '@/icons/CustomIcon';
import { useCallback, useMemo } from 'react';
import { useUpdateApplicationStage } from '@/hooks/useUpdateApplicationStage';
import InsightCard from '../insights/InsightCard';
import { Skeleton } from '../ui/skeleton';

const AppliedStage: React.FC<{ onStageChange: (stage: 'interview' | 'rejected') => void }> = ({
	onStageChange,
}) => {
	const { applicationId } = useParams<{ applicationId: string }>();
	const { mutate: updateStage } = useUpdateApplicationStage();

	// Poll for insights
	const { isPolling: isPollingInsightsGenerationRequest } = usePollInsightGenerationRequest(
		applicationId,
		'applied'
	);

	const { isLoading: insightsLoading, insights } = useReadInsights(applicationId, 'applied');

	const renderedInsights = useMemo(() => {
		if (!insights || insights.length === 0) {
			return <div className="text-center text-muted-foreground py-8">No insights available</div>;
		}

		const latestInsight = insights.sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)[0];

		if (!latestInsight) {
			return (
				<div className="text-center text-muted-foreground py-8">
					No insights available for current stage
				</div>
			);
		}

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{latestInsight.data?.map((insightData, index) => (
					<InsightCard key={`${latestInsight.id}-${index}`} insightData={insightData} />
				))}
			</div>
		);
	}, [insights]);

	const handleStageChange = useCallback(
		(newStage: 'interview' | 'rejected') => {
			if (!applicationId) return;
			updateStage({ applicationId, stage: newStage });
			onStageChange(newStage);
		},
		[applicationId, updateStage, onStageChange]
	);

	return (
		<div className="container mx-auto p-4 space-y-12">
			{/* Top Section - Waiting Icon */}
			<div className="flex flex-col items-center justify-center gap-4">
				<CustomIcon className="w-24 h-24 text-blue-500" name="waiting" />
				<h2 className="text-xl font-semibold text-muted-foreground">Waiting for a response...</h2>
			</div>

			{/* Middle Section - Insights */}
			<div>
				{insightsLoading || isPollingInsightsGenerationRequest ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<Skeleton className="h-[200px]" />
						<Skeleton className="h-[200px]" />
						<Skeleton className="h-[200px]" />
						<Skeleton className="h-[200px]" />
						<Skeleton className="h-[200px]" />
						<Skeleton className="h-[200px]" />
					</div>
				) : (
					renderedInsights
				)}
			</div>

			{/* Bottom Section - Action Cards */}
			<div className="grid grid-cols-2 gap-6">
				<Card
					className={cn(
						'bg-red-50 hover:bg-red-100 cursor-pointer',
						'transition-colors duration-200',
						'flex items-center justify-center p-8',
						'text-center'
					)}
					onClick={() => handleStageChange('rejected')}
				>
					<div className="space-y-2">
						<h3 className="text-xl font-semibold text-red-900">They're not interested</h3>
						<p className="text-sm text-red-700">Click here if you got rejected</p>
					</div>
				</Card>

				<Card
					className={cn(
						'bg-emerald-50 hover:bg-emerald-100 cursor-pointer',
						'transition-colors duration-200',
						'flex items-center justify-center p-8',
						'text-center'
					)}
					onClick={() => handleStageChange('interview')}
				>
					<div className="space-y-2">
						<h3 className="text-xl font-semibold text-emerald-900">Interview scheduled</h3>
						<p className="text-sm text-emerald-700">Click here if you got an interview</p>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default AppliedStage;
