import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { TInsightData } from '@redundant/common/src';

const InterviewInsight: React.FC<TInsightData> = ({ title, description, additionalData }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Card className="w-full">
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger className="w-full">
					<div className="flex items-center justify-between p-6 bg-purple-50 border-b hover:bg-purple-100 transition-colors">
						<div className="text-left">
							<h3 className="text-lg font-semibold text-purple-900">{title}</h3>
							<p className="text-sm text-purple-700 mt-1">{description}</p>
						</div>
						<ChevronDown
							className={cn(
								'h-5 w-5 text-purple-500 transition-transform duration-200',
								isOpen && 'transform rotate-180'
							)}
						/>
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="p-6 space-y-4">
						{additionalData?.map((item, index) => (
							<div key={index} className="space-y-2">
								<h4 className="font-semibold text-purple-900">{item.label}</h4>
								<p className="text-sm text-muted-foreground">{item.text}</p>
								{index < (additionalData?.length ?? 0) - 1 && (
									<div className="border-b border-purple-100 pt-4" />
								)}
							</div>
						))}
					</div>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
};

export default InterviewInsight;
