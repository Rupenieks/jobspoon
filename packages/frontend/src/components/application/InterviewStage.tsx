import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import CustomIcon from '@/icons/CustomIcon';
import { useParams } from 'react-router-dom';
import { usePollInsightGenerationRequest } from '@/hooks/usePollInsightGenerationRequest';
import { useReadInsights } from '@/hooks/useReadInsights';
import { Skeleton } from '../ui/skeleton';
import InsightCard from '../insights/InsightCard';
import { useCallback, useMemo, useState } from 'react';
import { Upload, FileText, Plus, Trash2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const InterviewStage: React.FC<{ onStageChange: (stage: 'success' | 'rejected') => void }> = ({
	onStageChange,
}) => {
	const { applicationId } = useParams<{ applicationId: string }>();
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
	const [interviewNotes, setInterviewNotes] = useState('');

	// Poll for insights
	const { isPolling: isPollingInsightsGenerationRequest } = usePollInsightGenerationRequest(
		applicationId,
		'interview'
	);

	const { isLoading: insightsLoading, insights } = useReadInsights(applicationId, 'interview');

	const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
		}
	}, []);

	const handleRemoveFile = useCallback((index: number) => {
		setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
	}, []);

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
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Left Column - Input Section */}
				<Card>
					<CardHeader>
						<CardTitle>Interview Materials</CardTitle>
						<CardDescription>
							Add notes and upload materials related to your interview process
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Notes Section */}
						<div className="space-y-2">
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

						<Separator />

						{/* Upload Section */}
						<div className="space-y-4">
							<div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors">
								<Button
									variant="ghost"
									className="flex flex-col gap-2 h-auto p-4"
									onClick={() => document.getElementById('file-upload')?.click()}
								>
									<Upload className="w-12 h-12 text-muted-foreground" />
									<span className="text-sm font-medium">Click to upload files</span>
									<span className="text-xs text-muted-foreground">
										Upload any interview materials, coding challenges, or documents
									</span>
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
								<ScrollArea className="h-[200px] border rounded-md p-2">
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
					</CardContent>
				</Card>

				{/* Right Column - Interview Insights */}
				<Card>
					<CardHeader>
						<CardTitle>Interview Help</CardTitle>
						<CardDescription>
							Tips and information to help you prepare for your interview
						</CardDescription>
					</CardHeader>
					<CardContent>
						{insightsLoading || isPollingInsightsGenerationRequest ? (
							<div className="space-y-4">
								<Skeleton className="h-[100px]" />
								<Skeleton className="h-[100px]" />
								<Skeleton className="h-[100px]" />
							</div>
						) : (
							renderedInsights
						)}
					</CardContent>
				</Card>
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
