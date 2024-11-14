import React from 'react';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import CustomIcon from '@/icons/CustomIcon';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ActionCardProps {
	icon: string;
	title: string;
	description: string;
	onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, onClick }) => (
	<Card
		className={cn(
			'w-72 h-80 cursor-pointer transition-colors',
			'hover:bg-muted/50',
			'flex flex-col items-center'
		)}
		onClick={onClick}
	>
		<CardContent className="h-full flex flex-col items-center justify-center gap-4 p-6">
			<div className="flex items-center justify-center h-[60%]">
				<CustomIcon name={icon} className="w-32 h-32" />
			</div>
			<Separator className="w-full" />
			<div className="text-center space-y-2">
				<h3 className="font-semibold text-lg">{title}</h3>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
		</CardContent>
	</Card>
);

const Start: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="h-full flex items-center justify-center p-8">
			<div className="flex gap-6">
				<ActionCard
					icon="create"
					title="Create Resume"
					description="Build a new resume from scratch"
					onClick={() => navigate('/resumes/new')}
				/>
				<ActionCard
					icon="create"
					title="Import Resume"
					description="Import an existing resume"
					onClick={() => navigate('/resumes/import')}
				/>
				<ActionCard
					icon="create"
					title="Use Template"
					description="Start with a pre-designed template"
					onClick={() => navigate('/templates')}
				/>
			</div>
		</div>
	);
};

export default Start;
