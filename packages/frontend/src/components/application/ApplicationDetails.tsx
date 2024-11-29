import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePollInsightGenerationRequest } from '@/hooks/usePollInsightGenerationRequest';
import { useReadApplication } from '@/hooks/useReadApplication';
import { useReadInsights } from '@/hooks/useReadInsights';
import { useUpdateApplicationStage } from '@/hooks/useUpdateApplicationStage';
import { cn } from '@/lib/utils';
import { Building2, Check, MapPin, Play } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { useParams } from 'react-router-dom';
import InsightCard from '../insights/InsightCard';
import ResumeEditingWrapper from '../resumes/ResumeEditingWrapper';
import { ResumeStateProvider } from '../resumes/ResumeStateContext';
import { Button } from '../ui/button';
import CompanyLogo from '../ui/company-logo';
import { ScrollArea } from '../ui/scroll-area';
import LoadingSkeleton from './ApplicationDetailsLoadingSkeleton';
import useDocumentTitle from '@/hooks/useDocumentTitle';

const ApplicationDetails: React.FC<{
	onChangeStage: (stage: 'applied' | 'interview' | 'success' | 'rejected') => void;
}> = ({ onChangeStage }) => {
	const { applicationId } = useParams<{ applicationId: string }>();
	const { data: application, isLoading } = useReadApplication(applicationId);
	const resumeId = useMemo(() => application?.resume.id, [application?.resume.id]);

	const { mutate: updateStage } = useUpdateApplicationStage();

	const [showConfetti, setShowConfetti] = useState(false);
	const [buttonRect, setButtonRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

	const handleStartApplication = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (!application) return;

			if (application.stage === 'not_applied') {
				// Get the button's position and dimensions for confetti
				const rect = event.currentTarget.getBoundingClientRect();
				setButtonRect({
					x: rect.x,
					y: rect.y,
					width: rect.width,
					height: rect.height,
				});

				setShowConfetti(true);
				updateStage({ applicationId: application.id, stage: 'applied' });
				onChangeStage('applied');
				setTimeout(() => setShowConfetti(false), 1000);
			} else {
				// If already applied, just navigate to current stage
				onChangeStage(application.stage as 'applied' | 'interview' | 'success' | 'rejected');
			}
		},
		[updateStage, application, onChangeStage]
	);

	// Poll for generation request
	const { isPolling: isPollingInsightsGenerationRequest } = usePollInsightGenerationRequest(
		applicationId,
		application?.stage
	);

	const { isLoading: insightsLoading, insights } = useReadInsights(applicationId, 'not_applied');
	const renderedInsights = useMemo(() => {
		if (!insights || (insights && insights.length === 0)) {
			return <div className="text-center text-muted-foreground py-8">No insights available</div>;
		}

		// Get latest insights for current stage
		const latestInsight = insights?.sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)[0];

		if (!latestInsight) {
			return (
				<div className="text-center text-muted-foreground py-8">
					No insights available for current stage
				</div>
			);
		}

		return latestInsight.data?.map((insightData, index) => (
			<InsightCard
				key={`${latestInsight.id}-${index}`}
				insightData={insightData}
				onApplyChanges={(changes) => {
					// TODO: Implement resume changes
					console.log('Applying changes:', changes);
				}}
			/>
		));
	}, [insights]);

	const handleApplyNow = useCallback(() => {
		if (!application) return;
		window.open(application.match.applyUrl || '', '_blank');
	}, [application]);

	if (isLoading) {
		return <LoadingSkeleton />;
	}

	if (!application || !resumeId) {
		return <div>Error loading application details</div>;
	}

	return (
		<div className="container mx-auto p-4 space-y-6">
			<div className="grid grid-cols-3 gap-6">
				{/* Left Column - Company & Job Info */}
				<div className="col-span-2 space-y-6">
					<Card>
						<CardHeader className="flex flex-row items-center gap-4">
							<div className="flex items-center justify-between w-full">
								<div className="flex items-center gap-4">
									<CompanyLogo domain={application.match.company?.domain || ''} />
									<div>
										<CardTitle>{application.match.positionTitle}</CardTitle>
										<CardDescription>{application.match.companyName}</CardDescription>
									</div>
								</div>

								<Button variant="default" onClick={handleApplyNow}>
									<Check className="h-4 w-4" />
									Apply now
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<Tabs defaultValue="overview">
								<TabsList>
									<TabsTrigger value="overview">Overview</TabsTrigger>
									<TabsTrigger value="company">Company</TabsTrigger>
									<TabsTrigger value="tech">Tech Stack</TabsTrigger>
								</TabsList>

								<TabsContent value="overview" className="space-y-4">
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div className="flex items-center gap-2 mt-2">
											<MapPin className="h-4 w-4" />
											<span>
												{application.match.city}, {application.match.country}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Building2 className="h-4 w-4" />
											<span>{application.match.company?.employeeCountRange}</span>
										</div>
										{/* Add more metadata */}
									</div>

									<div className="mt-4 flex flex-col gap-2">
										<h3 className="font-semibold mb-2">Job Description</h3>
										<ScrollArea className="h-[200px] py-2 border rounded-md p-2">
											<p className="text-sm text-muted-foreground whitespace-pre-wrap">
												{application.match.description}
											</p>
										</ScrollArea>
									</div>
								</TabsContent>

								<TabsContent value="company">
									<ScrollArea className="h-[300px]">
										<div className="space-y-4 mt-2">
											<p className="text-sm text-muted-foreground">
												{application.match.company?.description}
											</p>

											<div className="grid grid-cols-2 gap-4 text-sm">
												<div>
													<h4 className="font-medium">Industry</h4>
													<p className="text-muted-foreground">
														{application.match.company?.industry}
													</p>
												</div>
												<div>
													<h4 className="font-medium">Total Funding</h4>
													<p className="text-muted-foreground">
														$
														{application.match.company?.totalFunding
															? (application.match.company.totalFunding / 1000000).toFixed(1)
															: 'N/A'}
														M
													</p>
												</div>
												<div>
													<h4 className="font-medium">Company Size</h4>
													<p className="text-muted-foreground">
														{application.match.company?.employeeCount} employees
													</p>
												</div>
												<div>
													<h4 className="font-medium">Founded</h4>
													<p className="text-muted-foreground">
														{application.match.company?.foundedYear || 'N/A'}
													</p>
												</div>
											</div>
										</div>
									</ScrollArea>
								</TabsContent>

								<TabsContent value="tech">
									<div className="flex flex-wrap gap-2 mt-2 h-[300px]">
										<ScrollArea>
											{application.match.company?.technologies?.map((tech: string) => (
												<Badge key={tech} variant="default">
													{tech}
												</Badge>
											))}
										</ScrollArea>
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>

					{/* Resume Section */}
					<Card>
						<CardHeader>
							<CardTitle>Resume</CardTitle>
						</CardHeader>
						<CardContent>
							<ResumeStateProvider resumeId={resumeId}>
								<ResumeEditingWrapper />
							</ResumeStateProvider>
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Application Progress */}
				<div className="space-y-6">
					<div className="relative">
						<Card
							className={cn(
								'bg-emerald-50 hover:bg-emerald-100 cursor-pointer',
								'transition-colors duration-200',
								'flex items-center justify-between p-6',
								application.stage !== 'not_applied' && 'opacity-75'
							)}
							onClick={handleStartApplication}
						>
							<div className="space-y-1.5">
								<h3 className="text-xl font-semibold text-emerald-900">
									{application.stage === 'not_applied'
										? 'Click when you have applied'
										: 'You have already applied'}
								</h3>
								<CardDescription className="text-emerald-700">
									{application.stage === 'not_applied'
										? "We'll help you handle the next steps"
										: 'Click here to go to current stage'}
								</CardDescription>
							</div>
							<div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500 text-white">
								{application.stage === 'not_applied' ? (
									<Play className="h-6 w-6" />
								) : (
									<Check className="h-6 w-6" />
								)}
							</div>
						</Card>
						{showConfetti && (
							<ReactConfetti
								width={buttonRect.width}
								height={300}
								recycle={false}
								numberOfPieces={50}
								gravity={0.5}
								initialVelocityY={3}
								confettiSource={{
									x: buttonRect.x,
									y: buttonRect.y,
									w: buttonRect.width,
									h: 0,
								}}
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									pointerEvents: 'none',
								}}
							/>
						)}
					</div>
					<Card>
						<CardHeader>
							<CardTitle>Tips</CardTitle>
							<CardDescription>Consider these points to help you succeed</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{insightsLoading || isPollingInsightsGenerationRequest ? (
								<>
									<Skeleton className="w-full h-[72px]" />
									<Skeleton className="w-full h-[72px]" />
									<Skeleton className="w-full h-[72px]" />
								</>
							) : (
								renderedInsights
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default ApplicationDetails;
