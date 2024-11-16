import {
	ChartConfig,
	DonutChartContainer,
	DonutChartTooltipContent,
} from '@/components/ui/donut-chart';
import CustomIcon from '@/icons/CustomIcon';
import { useMemo } from 'react';
import { Cell, Label, Pie, PieChart, Tooltip } from 'recharts';

const stageColors = {
	not_applied: 'hsl(240 4.8% 95.9%)',
	applied: 'hsl(221 83% 53%)',
	interview: 'hsl(48 96% 53%)',
	success: 'hsl(142 72% 29%)',
	rejected: 'hsl(0 84% 60%)',
} as const;

const chartConfig = {
	not_applied: {
		label: 'Not Applied',
		color: stageColors.not_applied,
	},
	applied: {
		label: 'Applied',
		color: stageColors.applied,
	},
	interview: {
		label: 'Interview',
		color: stageColors.interview,
	},
	success: {
		label: 'Success',
		color: stageColors.success,
	},
	rejected: {
		label: 'Rejected',
		color: stageColors.rejected,
	},
} satisfies ChartConfig;

interface ApplicationStageAnalyticsDonutChartProps {
	data?: Array<{ name: string; value: number }>;
	totalApplications: number;
}

export const ApplicationStageAnalyticsDonutChart = ({
	data,
	totalApplications,
}: ApplicationStageAnalyticsDonutChartProps) => {
	const isEmpty = useMemo(() => data?.every((item) => item.value === 0), [data]);

	if (!data?.length || isEmpty) {
		return (
			<div className="flex flex-col items-center justify-center h-[300px] gap-4">
				<CustomIcon name="no-data" className="h-24 w-24 text-muted-foreground" />
				<p className="text-muted-foreground text-sm">No application data yet</p>
			</div>
		);
	}

	return (
		<DonutChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
			<PieChart>
				<Pie
					data={data}
					dataKey="value"
					nameKey="name"
					cx="50%"
					cy="50%"
					innerRadius={60}
					outerRadius={80}
					paddingAngle={2}
				>
					{data.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={stageColors[entry.name as keyof typeof stageColors]}
						/>
					))}
					<Label
						content={({ viewBox }) => {
							if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
								return (
									<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
										<tspan
											x={viewBox.cx}
											y={viewBox.cy}
											className="fill-foreground text-3xl font-bold"
										>
											{totalApplications}
										</tspan>
										<tspan
											x={viewBox.cx}
											y={(viewBox.cy || 0) + 24}
											className="fill-muted-foreground"
										>
											Applications
										</tspan>
									</text>
								);
							}
						}}
					/>
				</Pie>
				<Tooltip content={<DonutChartTooltipContent />} />
			</PieChart>
		</DonutChartContainer>
	);
};
