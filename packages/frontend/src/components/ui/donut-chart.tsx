import * as React from 'react';
import { ResponsiveContainer, TooltipProps } from 'recharts';
import { cn } from '@/lib/utils';

export interface ChartConfig {
	[key: string]: {
		label: string;
		color?: string;
	};
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	config: ChartConfig;
}

export function DonutChartContainer({
	config,
	children,
	className,
	...props
}: ChartContainerProps) {
	return (
		<div className={cn('h-[400px]', className)} {...props}>
			<ResponsiveContainer width="100%" height="100%">
				{children as React.ReactElement}
			</ResponsiveContainer>
		</div>
	);
}

interface ChartTooltipContentProps extends TooltipProps<any, any> {
	hideLabel?: boolean;
}

export function DonutChartTooltipContent({
	active,
	payload,
	hideLabel = false,
}: ChartTooltipContentProps) {
	if (!active || !payload) return null;

	return (
		<div className="rounded-lg border bg-background p-2 shadow-sm">
			<div className="grid grid-cols-2 gap-2">
				<div className="flex flex-col">
					<span className="text-[0.70rem] uppercase text-muted-foreground">
						{hideLabel ? 'Value' : payload[0]?.name}
					</span>
					<span className="font-bold text-muted-foreground">{payload[0]?.value}</span>
				</div>
			</div>
		</div>
	);
}
