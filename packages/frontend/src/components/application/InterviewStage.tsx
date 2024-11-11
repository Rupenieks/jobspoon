import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { usePollInsightGenerationRequest } from '@/hooks/usePollInsightGenerationRequest';
import { useReadInsights } from '@/hooks/useReadInsights';
import { useSubmitApplicationInterviewMaterials } from '@/hooks/useSubmitApplicationInterviewMaterials';
import CustomIcon from '@/icons/CustomIcon';
import { cn } from '@/lib/utils';
import { FileText, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import InsightCard from '../insights/InsightCard';
import InterviewInsight from '../insights/InterviewInsight';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';

const InterviewStage: React.FC<{ onStageChange: (stage: 'success' | 'rejected') => void }> = ({
	onStageChange,
}) => {
	const { applicationId } = useParams<{ applicationId: string }>();
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
	const [interviewNotes, setInterviewNotes] = useState('');

	const { mutate: submitMaterials, isPending: isSubmitting } =
		useSubmitApplicationInterviewMaterials();

	// Poll for insights
	const { isPolling: isPollingInsightsGenerationRequest } = usePollInsightGenerationRequest(
		applicationId,
		'interview'
	);

	const { isLoading: insightsLoading, insights } = useReadInsights(applicationId, 'interview');

	console.log(insights);

	const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
		}
	}, []);

	const handleRemoveFile = useCallback((index: number) => {
		setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const handleSubmit = useCallback(() => {
		if (!applicationId) return;

		submitMaterials(
			{
				applicationId,
				notes: interviewNotes,
				files: uploadedFiles,
			},
			{
				onSuccess: (data) => {
					// Clear the form
					setInterviewNotes('');
					setUploadedFiles([]);
					toast({
						title: 'Materials submitted',
						description: "We'll analyze these and provide insights shortly",
					});
				},
			}
		);
	}, [applicationId, interviewNotes, uploadedFiles, submitMaterials]);

	const renderedInsights = useMemo(() => {
		if (!insights || insights.length === 0) {
			return <div className="text-center text-muted-foreground py-8">No insights available</div>;
		}

		const latestInsight = insights.sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)[0];

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{latestInsight.data?.map((insightData, index) => (
					<InsightCard key={`${latestInsight.id}-${index}`} insightData={insightData} />
				))}
			</div>
		);
	}, [insights]);

	return (
		<div className="container mx-auto p-4 space-y-12">
			{/* Top Section - Interview Icon */}
			<div className="flex flex-col items-center justify-center gap-4">
				<CustomIcon className="w-24 h-24 text-purple-500" name="interview" />
				<h2 className="text-xl font-semibold text-muted-foreground">Interview Stage</h2>
			</div>

			{/* Middle Section - Interview Materials */}
			<div className="space-y-8">
				{/* Input Section */}
				<Card>
					<CardContent className="p-6">
						<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
							{/* Notes Section - Takes up 3 columns */}
							<div className="lg:col-span-3 space-y-2">
								<label htmlFor="interview-notes" className="text-sm font-medium">
									Interview Notes
								</label>
								<Textarea
									id="interview-notes"
									placeholder="Add any notes about your interview process, requirements, or tasks..."
									className="min-h-[120px] resize-none"
									value={interviewNotes}
									onChange={(e) => setInterviewNotes(e.target.value)}
								/>
							</div>

							{/* Upload Section - Takes up 2 columns */}
							<div className="lg:col-span-2 space-y-4">
								<div className="border-2 border-dashed rounded-lg hover:border-primary/50 transition-colors">
									<Button
										variant="ghost"
										className="w-full h-auto p-0 hover:bg-transparent"
										onClick={() => document.getElementById('file-upload')?.click()}
									>
										<div className="flex items-stretch w-full">
											<div className="flex items-center justify-center w-24 min-h-[100px] border-r border-dashed">
												<CustomIcon name="upload" className="w-12 h-12 text-muted-foreground" />
											</div>
											<div className="flex-1 flex flex-col justify-center p-4 text-left">
												<span className="text-sm font-medium">Upload files</span>
												<span className="text-xs text-muted-foreground mt-1 break-words">
													Add interview materials or documents
												</span>
											</div>
										</div>
									</Button>
									<input
										type="file"
										id="file-upload"
										className="hidden"
										multiple
										onChange={handleFileUpload}
									/>
								</div>

								{uploadedFiles.length > 0 && (
									<ScrollArea className="h-[150px] border rounded-md p-2">
										<div className="space-y-2">
											{uploadedFiles.map((file, index) => (
												<div
													key={index}
													className="flex items-center justify-between p-2 bg-muted rounded-md"
												>
													<div className="flex items-center gap-2">
														<FileText className="h-4 w-4" />
														<span className="text-sm truncate max-w-[200px]">{file.name}</span>
													</div>
													<Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											))}
										</div>
									</ScrollArea>
								)}
							</div>
						</div>

						<Separator className="my-6" />

						<Button
							className="w-full"
							onClick={handleSubmit}
							disabled={!interviewNotes && uploadedFiles.length === 0}
						>
							Submit Materials
						</Button>
					</CardContent>
				</Card>

				{/* Insights Section */}
				<div className="space-y-6">
					<h3 className="text-lg font-semibold">Interview Insights</h3>
					{insightsLoading || isPollingInsightsGenerationRequest ? (
						<div className="space-y-4">
							<Skeleton className="h-[200px]" />
							<Skeleton className="h-[200px]" />
						</div>
					) : (
						<div className="space-y-6">
							{insights?.[0]?.data?.map((insight, index) => (
								<InterviewInsight key={index} {...insight} />
							))}
						</div>
					)}
				</div>
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
					onClick={() => onStageChange('rejected')}
				>
					<div className="space-y-2">
						<h3 className="text-xl font-semibold text-red-900">Not Selected</h3>
						<p className="text-sm text-red-700">Click here if you didn't get the job</p>
					</div>
				</Card>

				<Card
					className={cn(
						'bg-emerald-50 hover:bg-emerald-100 cursor-pointer',
						'transition-colors duration-200',
						'flex items-center justify-center p-8',
						'text-center'
					)}
					onClick={() => onStageChange('success')}
				>
					<div className="space-y-2">
						<h3 className="text-xl font-semibold text-emerald-900">Got the Job!</h3>
						<p className="text-sm text-emerald-700">Click here if you got the offer</p>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default InterviewStage;
