import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TInsightData } from '@redundant/common';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface InsightCardProps {
	insightData: TInsightData;
	onApplyChanges?: (changes: any) => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ insightData, onApplyChanges }) => {
	const getIcon = () => {
		switch (insightData.insightColor) {
			case 'danger':
				return AlertCircle;
			case 'warning':
				return AlertTriangle;
			default:
				return Info;
		}
	};

	const getVariant = () => {
		switch (insightData.insightColor) {
			case 'danger':
				return 'destructive';
			case 'warning':
				return 'default';
			default:
				return 'default';
		}
	};

	const Icon = getIcon();

	return (
		<Alert variant={getVariant()}>
			<Icon className="h-4 w-4" />
			<AlertTitle>{insightData.title}</AlertTitle>
			<AlertDescription className="flex justify-between items-start">
				<span>{insightData.description}</span>
				{/* TODO: Add apply changes */}
				{/* {insightData.resumeChangeData && Object.keys(insightData.resumeChangeData).length > 0 && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="ml-2"
									onClick={() => onApplyChanges?.(insightData.resumeChangeData)}
								>
									<Wand2 className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Apply changes</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)} */}
			</AlertDescription>
		</Alert>
	);
};

export default InsightCard;
