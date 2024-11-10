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

	const getStyles = () => {
		switch (insightData.insightColor) {
			case 'danger':
				return 'bg-red-50 border-red-200 text-red-900';
			case 'warning':
				return 'bg-amber-50 border-amber-200 text-amber-900';
			default:
				return 'bg-blue-50 border-blue-200 text-blue-900';
		}
	};

	const getDescriptionStyles = () => {
		switch (insightData.insightColor) {
			case 'danger':
				return 'text-red-700';
			case 'warning':
				return 'text-amber-700';
			default:
				return 'text-blue-700';
		}
	};

	const getMutedStyles = () => {
		switch (insightData.insightColor) {
			case 'danger':
				return 'text-red-500';
			case 'warning':
				return 'text-amber-500';
			default:
				return 'text-blue-500';
		}
	};

	const Icon = getIcon();

	return (
		<Alert className={getStyles()}>
			<Icon className={`h-4 w-4 ${getMutedStyles()}`} />
			<AlertTitle className="line-clamp-1">{insightData.title}</AlertTitle>
			<AlertDescription className="space-y-2">
				<p className={getDescriptionStyles()}>{insightData.description}</p>

				{insightData.additionalData && insightData.additionalData.length > 0 && (
					<div className="mt-4 grid grid-cols-2 gap-2 text-sm border-t pt-2 border-current border-opacity-10">
						{insightData.additionalData.map((item, index) => (
							<div key={index} className="flex flex-col min-w-0">
								<span className={`font-medium ${getMutedStyles()} truncate`}>{item.label}</span>
								<span className={`${getDescriptionStyles()} break-words`}>{item.text}</span>
							</div>
						))}
					</div>
				)}
			</AlertDescription>
		</Alert>
	);
};

export default InsightCard;
