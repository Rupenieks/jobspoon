import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePollInsightGenerationRequest } from '@/hooks/usePollInsightGenerationRequest';
import { useReadApplication } from '@/hooks/useReadApplication';
import { useReadInsights } from '@/hooks/useReadInsights';
import { useUpdateApplicationStage } from '@/hooks/useUpdateApplicationStage';
import { Building2, CheckCircle, ChevronLeft, MapPin } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InsightCard from '../insights/InsightCard';
import ResumeEditingWrapper from '../resumes/ResumeEditingWrapper';
import { ResumeStateProvider } from '../resumes/ResumeStateContext';
import CompanyLogo from '../ui/company-logo';
import { ScrollArea } from '../ui/scroll-area';
import LoadingSkeleton from './ApplicationDetailsLoadingSkeleton';
import withApplicationResumeEditing from './withApplicationResumeEditing';

const ApplicationDetails: React.FC = () => {
	const { applicationId } = useParams<{ applicationId: string }>();
	const navigate = useNavigate();
	const { data: application, isLoading } = useReadApplication(applicationId);

	const resumeId = useMemo(() => application?.resume.id, [application?.resume.id]);

	const handleGoBack = useCallback(() => {
		navigate('/applications');
	}, [navigate]);

	const { mutate: updateStage } = useUpdateApplicationStage();

	// Poll for generation request
	const { isPolling: isPollingInsightsGenerationRequest } = usePollInsightGenerationRequest(
		applicationId,
		application?.stage
	);

	const { isLoading: insightsLoading, insights } = useReadInsights(
		applicationId,
		application?.stage
	);
	const renderedInsights = useMemo(() => {
		console.log('Insights', insights);
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
							<CompanyLogo domain={application.match.company?.domain || ''} />
							<div>
								<CardTitle>{application.match.positionTitle}</CardTitle>
								<CardDescription>{application.match.companyName}</CardDescription>
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
										<div className="flex items-center gap-2">
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

									<div className="mt-4">
										<h3 className="font-semibold mb-2">Job Description</h3>
										<ScrollArea className="h-[200px]">
											<p className="text-sm text-muted-foreground whitespace-pre-wrap">
												{application.match.description}
											</p>
										</ScrollArea>
									</div>
								</TabsContent>

								<TabsContent value="company">
									<ScrollArea className="h-[300px]">
										<div className="space-y-4">
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
									<ScrollArea className="h-[300px]">
										<div className="flex flex-wrap gap-2">
											{application.match.company?.technologies?.map((tech) => (
												<Badge key={tech} variant="secondary">
													{tech}
												</Badge>
											))}
										</div>
									</ScrollArea>
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
					<Card>
						<CardHeader>
							<CardTitle>Application Progress</CardTitle>
							<CardDescription>
								When you have finished your resume and applied to the job, click here and we'll
								provide you tips to help you succeed
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{application.stage === 'not_applied' ? (
								<Button
									className="w-full"
									variant="default"
									onClick={() => updateStage({ applicationId: application.id, stage: 'applied' })}
								>
									<CheckCircle className="mr-2 h-4 w-4" />I have applied
								</Button>
							) : (
								<div className="space-y-4">
									<Select
										value={application.stage}
										onValueChange={(value) =>
											updateStage({
												applicationId: application.id,
												stage: value as any,
											})
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="applied">
												<Badge variant="default">Applied</Badge>
											</SelectItem>
											<SelectItem value="interview">
												<Badge variant="secondary">Interview</Badge>
											</SelectItem>
											<SelectItem value="success">
												<Badge variant="outline">Success</Badge>
											</SelectItem>
											<SelectItem value="rejected">
												<Badge variant="destructive">Rejected</Badge>
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							)}
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Job Insights</CardTitle>
							<CardDescription>AI-generated insights about this role</CardDescription>
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
