import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useCreateApplication } from '@/hooks/useCreateApplication';
import { useGetMatch } from '@/hooks/useGetMatch';
import { useReadApplications } from '@/hooks/useReadApplications';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Building, Building2, Calendar, MapPin, Plus, Users2 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from './ui/separator';

interface JobMatchDialogProps {
	matchId: string | undefined;
	isOpen: boolean;
	onClose: () => void;
}

const JobMatchDialog: React.FC<JobMatchDialogProps> = ({ matchId, isOpen, onClose }) => {
	const { match, isPending } = useGetMatch(matchId);
	const navigate = useNavigate();
	const { data: applications } = useReadApplications();
	const { mutateAsync: createApplication } = useCreateApplication();

	const existingApplication = applications?.find((app) => app.matchId === matchId);

	const handleCreateApplication = async () => {
		if (!match?.id) return;

		try {
			const application = await createApplication({
				resumeId: match.resumeId,
				matchId: match.id,
			});

			toast({
				title: 'Application created',
				description: 'You can now track your application progress',
			});

			onClose();
			navigate(`/applications/${application.id}`);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to create application',
				variant: 'destructive',
			});
		}
	};

	if (!matchId) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl h-[85vh] flex flex-col">
				{isPending ? (
					<div className="space-y-4 p-6">
						<Skeleton className="h-8 w-2/3" />
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-4 w-1/3" />
					</div>
				) : (
					<>
						<DialogHeader className="px-6 pt-6 flex-none">
							<DialogTitle className="text-2xl font-bold">{match?.positionTitle}</DialogTitle>
							<div className="flex flex-col space-y-2 mt-4">
								<div className="flex items-center gap-2">
									<Building2 className="h-4 w-4 text-muted-foreground" />
									<span>{match?.companyName}</span>
								</div>
								<div className="flex items-center gap-2">
									<MapPin className="h-4 w-4 text-muted-foreground" />
									<span>
										{match?.city}, {match?.country}
										{match?.remote && ' • Remote'}
										{match?.hybrid && ' • Hybrid'}
									</span>
								</div>
								{match?.datePosted && (
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4 text-muted-foreground" />
										<span>
											Posted {formatDistanceToNow(new Date(match.datePosted), { addSuffix: true })}
										</span>
									</div>
								)}
								{match?.salary && (
									<Badge variant="secondary" className="w-fit">
										{match.salary}
									</Badge>
								)}
							</div>
						</DialogHeader>

						<Separator className="my-4" />

						<div className="flex-1 min-h-0 flex flex-col">
							<Tabs defaultValue="description" className="flex-1 flex flex-col min-h-0">
								<TabsList className="mx-6 flex-none">
									<TabsTrigger value="description">Description</TabsTrigger>
									<TabsTrigger value="company">Company Info</TabsTrigger>
								</TabsList>

								<div className="flex-1 overflow-y-auto">
									<TabsContent value="description" className="px-6 mt-4 h-full">
										<div className="border rounded-lg p-4">
											<p className="text-sm text-muted-foreground whitespace-pre-wrap">
												{match?.description}
											</p>
										</div>
									</TabsContent>

									<TabsContent value="company" className="px-6 mt-4 h-full">
										<div className="space-y-6">
											<div className="grid grid-cols-2 gap-4">
												{match?.company?.employeeCount && (
													<div className="flex items-center gap-2">
														<Users2 className="h-4 w-4 text-muted-foreground" />
														<div>
															<span className="text-sm text-muted-foreground block">Employees</span>
															<span className="font-medium">
																{match.company.employeeCount.toLocaleString()}
															</span>
														</div>
													</div>
												)}

												{match?.company?.industry && (
													<div className="flex items-center gap-2">
														<Building className="h-4 w-4 text-muted-foreground" />
														<div>
															<span className="text-sm text-muted-foreground block">Industry</span>
															<span className="font-medium">{match.company.industry}</span>
														</div>
													</div>
												)}
											</div>

											{match?.company?.technologies && match.company.technologies.length > 0 && (
												<Accordion type="single" collapsible className="w-full">
													<AccordionItem value="technologies" className="border rounded-lg">
														<AccordionTrigger className="px-4 hover:no-underline">
															<div className="flex items-center gap-2">
																<span className="font-medium">Technologies</span>
																<span className="text-sm text-muted-foreground">
																	({match.company.technologies.length})
																</span>
															</div>
														</AccordionTrigger>
														<AccordionContent className="px-4 pb-4">
															<div className="flex flex-wrap gap-2">
																{match.company.technologies.map((tech) => (
																	<Badge key={tech} variant="secondary">
																		{tech}
																	</Badge>
																))}
															</div>
														</AccordionContent>
													</AccordionItem>
												</Accordion>
											)}
										</div>
									</TabsContent>
								</div>
							</Tabs>
						</div>

						<DialogFooter className="px-6 py-4 border-t mt-auto flex-none">
							<div className="flex gap-4 w-full">
								<Button
									className="flex-1"
									onClick={() => {
										if (existingApplication) {
											onClose();
											navigate(`/applications/${existingApplication.id}`);
										} else {
											handleCreateApplication();
										}
									}}
								>
									{existingApplication ? (
										<>
											Go to application <ArrowRight className="ml-2 h-4 w-4" />
										</>
									) : (
										<>
											Create application <Plus className="ml-2 h-4 w-4" />
										</>
									)}
								</Button>
							</div>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default JobMatchDialog;
