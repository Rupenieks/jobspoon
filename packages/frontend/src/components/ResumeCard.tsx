import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { TResumeBase } from '@redundant/common/src';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';

interface ResumeCardProps {
	resume?: TResumeBase;
	isLoading?: boolean;
	isSelected?: boolean;
	onCheckboxChange?: (checked: boolean) => void;
	onClick?: () => void;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
	resume,
	isLoading,
	isSelected,
	onCheckboxChange,
	onClick,
}) => {
	if (isLoading) {
		return (
			<Card className="relative overflow-hidden" style={{ aspectRatio: '1/1.4142' }}>
				<CardHeader className="p-6">
					<Skeleton className="h-7 w-48" />
					<Skeleton className="h-5 w-32 mt-2" />
				</CardHeader>
				<CardContent className="p-6 pt-0">
					<div className="flex-1">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4 mt-2" />
					</div>
				</CardContent>
				<CardFooter className="p-6">
					<Skeleton className="h-4 w-36" />
				</CardFooter>
				<div className="h-2 w-full flex absolute bottom-0">
					<Skeleton className="h-full w-1/2" />
					<Skeleton className="h-full w-1/2" />
				</div>
			</Card>
		);
	}

	if (!resume) return null;

	return (
		<Card
			className="group relative overflow-hidden transition-all hover:shadow-md"
			style={{ aspectRatio: '1/1.4142' }}
		>
			<div className="absolute top-4 right-4 z-10">
				<Checkbox
					checked={isSelected}
					onCheckedChange={(checked) => onCheckboxChange?.(checked as boolean)}
					onClick={(e) => e.stopPropagation()}
				/>
			</div>

			<div
				className="h-full flex flex-col cursor-pointer group-hover:bg-secondary transition-colors"
				onClick={onClick}
			>
				<CardHeader className="p-6">
					<h3 className="text-xl font-semibold text-foreground">
						{resume.data.personalInfo?.positionName}
					</h3>
					<p className="text-base text-muted-foreground">{resume.data.personalInfo?.fullName}</p>
				</CardHeader>

				<CardContent className="flex-1 p-6 pt-0">
					<p className="text-sm text-muted-foreground line-clamp-4">
						{resume.data.personalInfo?.profileBio}
					</p>
				</CardContent>

				<CardFooter className="p-6">
					<p className="text-sm text-muted-foreground">
						Created {formatDistanceToNow(new Date(resume.createdAt))} ago
					</p>
				</CardFooter>

				<div className="h-2 w-full flex absolute bottom-0">
					<div
						className="h-full w-1/2"
						style={{ backgroundColor: resume.data.config.primaryColor }}
					/>
					<div
						className="h-full w-1/2"
						style={{ backgroundColor: resume.data.config.sidebarColor }}
					/>
				</div>
			</div>
		</Card>
	);
};
