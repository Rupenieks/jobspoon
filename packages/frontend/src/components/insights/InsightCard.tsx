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
			<AlertDescription className="space-y-2">
				<p>{insightData.description}</p>

				{insightData.additionalData && insightData.additionalData.length > 0 && (
					<div className="mt-4 grid grid-cols-2 gap-2 text-sm border-t pt-2">
						{insightData.additionalData.map((item, index) => (
							<div key={index} className="flex flex-col">
								<span className="text-muted-foreground font-medium">{item.label}</span>
								<span>{item.text}</span>
							</div>
						))}
					</div>
				)}
			</AlertDescription>
		</Alert>
	);
};

export default InsightCard;
