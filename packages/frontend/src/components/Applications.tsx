import React from 'react';
import { useReadApplications } from '@/hooks/useReadApplications';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, FileText, MoreVertical, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { useDeleteApplications } from '@/hooks/useDeleteApplications';
import CompanyLogo from './ui/company-logo';
import { Separator } from './ui/separator';
import CustomIcon from '@/icons/CustomIcon';

const getStatusBadge = (stage: string) => {
	switch (stage) {
		case 'not_applied':
			return <Badge variant="secondary">Not Applied</Badge>;
		case 'applied':
			return <Badge variant="info">Applied</Badge>;
		case 'interview':
			return <Badge variant="warning">Interview</Badge>;
		case 'success':
			return <Badge variant="success">Success</Badge>;
		case 'rejected':
			return <Badge variant="destructive">Rejected</Badge>;
		default:
			return <Badge variant="secondary">Unknown</Badge>;
	}
};

const Applications: React.FC = () => {
	const { data: applications, isLoading } = useReadApplications();
	const { mutateAsync: deleteApplication } = useDeleteApplications();
	const navigate = useNavigate();

	const handleDelete = async (e: React.MouseEvent, applicationId: string) => {
		e.stopPropagation();
		try {
			await deleteApplication([applicationId]);
			toast({
				title: 'Application deleted',
				description: 'The application has been removed',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete application',
				variant: 'destructive',
			});
		}
	};

	const TableContent = () => (
		<Table className="border rounded-lg">
			<TableHeader className="bg-gray-50">
				<TableRow className="hover:bg-muted">
					<TableHead className="font-semibold">Company</TableHead>

					<TableHead className="font-semibold">Position</TableHead>

					<TableHead className="font-semibold">Status</TableHead>
					<TableHead className="font-semibold">Resume</TableHead>
					<TableHead className="font-semibold">Created</TableHead>
					<TableHead className="font-semibold"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{isLoading ? (
					[...Array(4)].map((_, index) => (
						<TableRow key={index} className="border-b">
							<TableCell>
								<Skeleton className="h-4 w-[140px]" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-[180px]" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-6 w-[80px]" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-8 w-8" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-[100px]" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-8 w-8 ml-auto" />
							</TableCell>
						</TableRow>
					))
				) : applications?.length === 0 ? (
					<TableRow>
						<TableCell colSpan={6}>
							<div className="col-span-full text-center text-muted-foreground flex flex-col items-center justify-center py-8">
								<div
									onClick={() => navigate('/matches')}
									className="flex flex-col justify-center items-center cursor-pointer hover:bg-secondary transition-colors duration-200 rounded-lg p-4"
								>
									<CustomIcon name="no-data" className="h-48 w-48" />
									<span className="text-sm mt-2 font-medium">No applications found</span>
									<span className="text-sm mt-2 text-muted-foreground">
										Click to browse job matches
									</span>
								</div>
							</div>
						</TableCell>
					</TableRow>
				) : (
					applications?.map((application) => (
						<TableRow
							key={application.id}
							className="cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
							onClick={() => navigate(`/applications/${application.id}`)}
						>
							<TableCell className="font-medium">
								<div className="flex items-center gap-2">
									<CompanyLogo domain={application.match.company?.domain || ''} />
									{application.match.companyName || 'Company not specified'}
								</div>
							</TableCell>
							<TableCell>{application.match.positionTitle}</TableCell>

							<TableCell>{getStatusBadge(application.stage)}</TableCell>
							<TableCell>
								<TooltipProvider>
									<Tooltip delayDuration={100}>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												onClick={(e) => {
													e.stopPropagation();
													navigate(`/resumes/${application.resumeId}`);
												}}
											>
												<div className="flex items-center">
													<FileText className="h-4 w-4" />
													<ArrowRight className="h-3 w-3" />
												</div>
											</Button>
										</TooltipTrigger>
										<TooltipContent>Go to resume</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</TableCell>
							<TableCell>
								{formatDistanceToNow(new Date(application.createdAt), {
									addSuffix: true,
								})}
							</TableCell>
							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
										<Button variant="ghost" size="icon">
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											className="text-destructive focus:text-destructive"
											onClick={(e) => handleDelete(e, application.id)}
										>
											<Trash2 className="h-4 w-4 mr-2" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);

	return (
		<div className="container mx-auto px-4 flex flex-col">
			<div className="flex justify-between items-center">
				<div className="flex flex-col gap-1.5">
					<h1 className="text-2xl font-semibold tracking-tight">Your Applications</h1>
					<p className="text-sm text-muted-foreground">
						Track your applications, use them to help improve your resume and move through the
						process
					</p>
				</div>
			</div>
			<Separator className="my-6" />
			<div className="border rounded-lg">
				<TableContent />
			</div>
		</div>
	);
};

export default Applications;
