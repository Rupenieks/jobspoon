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
import { Check, FileText, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import InterviewInsight from '../insights/InterviewInsight';
import CustomColorRing from '../loaders/ColorRing';
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

	console.log(uploadedFiles);

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
						{isSubmitting || isPollingInsightsGenerationRequest ? (
							<div className="flex flex-col items-center justify-center py-12">
								<CustomColorRing colors={['#8B5CF6', '#6D28D9', '#4C1D95', '#3B0764', '#1E0038']} />
								<p className="text-sm text-muted-foreground mt-4">Analyzing your materials...</p>
							</div>
						) : (
							<>
								<div className="flex flex-col lg:flex-row gap-6">
									{/* Notes Section */}
									<div className="flex-1 space-y-2">
										<label htmlFor="interview-notes" className="text-sm font-medium">
											Interview Notes
										</label>
										<Textarea
											id="interview-notes"
											placeholder="Add any notes about your interview process, requirements, or tasks. You may also paste your email conversation with the recruiter here."
											className="min-h-[120px] resize-none"
											value={interviewNotes}
											onChange={(e) => setInterviewNotes(e.target.value)}
										/>
									</div>

									{/* Upload Section */}
									<div className="w-full lg:w-72 space-y-4">
										<div
											onClick={() => document.getElementById('file-upload')?.click()}
											className="border-2 border-dashed rounded-lg cursor-pointer hover:bg-purple-50 transition-colors items-center flex-col flex p-2"
										>
											<CustomIcon
												name="upload"
												className="w-16 h-16 text-muted-foreground flex-shrink-0"
											/>

											<div className="flex items-center gap-4 p-6">
												<div className="text-left">
													<span className="text-sm font-medium block">Upload files</span>
													<span className="text-xs text-muted-foreground mt-1 block">
														Add interview materials or documents
													</span>
												</div>
											</div>
											<input
												type="file"
												id="file-upload"
												className="hidden"
												multiple
												onChange={handleFileUpload}
											/>
										</div>
									</div>
								</div>

								<Separator className="my-6" />
								<div className="flex justify-between">
									<div className="flex flex-wrap gap-2">
										{uploadedFiles.length > 0 &&
											uploadedFiles.map((file, index) => (
												<div
													key={index}
													className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-full text-sm border border-purple-100"
												>
													<FileText className="h-4 w-4 text-muted-foreground" />
													<span className="truncate max-w-[120px]">{file.name}</span>
													<Button
														variant="ghost"
														size="sm"
														className="h-4 w-4 p-0 hover:bg-transparent"
														onClick={() => handleRemoveFile(index)}
													>
														<X className="h-3 w-3" />
													</Button>
												</div>
											))}
									</div>
									<Button
										onClick={handleSubmit}
										disabled={!interviewNotes && uploadedFiles.length === 0}
									>
										Submit Materials
										<Check className="w-4 h-4 ml-2" />
									</Button>
								</div>
							</>
						)}
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
