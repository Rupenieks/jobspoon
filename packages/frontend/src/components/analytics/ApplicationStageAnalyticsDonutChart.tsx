import {
	ChartConfig,
	DonutChartContainer,
	DonutChartTooltipContent,
} from '@/components/ui/donut-chart';
import CustomIcon from '@/icons/CustomIcon';
import { useMemo } from 'react';
import { Cell, Label, Pie, PieChart, Tooltip, ResponsiveContainer } from 'recharts';

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

const Legend = ({ data }: { data: Array<{ name: string; color: string; label: string }> }) => (
	<div className="flex flex-wrap justify-center gap-4 mt-6">
		{data.map((item) => (
			<div key={item.name} className="flex items-center gap-2">
				<div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
				<span className="text-sm text-muted-foreground">{item.label}</span>
			</div>
		))}
	</div>
);

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

	const chartData = data.map((item) => ({
		name: item.name,
		value: item.value,
		color: stageColors[item.name as keyof typeof stageColors],
		label: chartConfig[item.name as keyof typeof chartConfig].label,
	}));

	return (
		<div className="w-full">
			<div className="flex justify-center">
				<ResponsiveContainer width="100%" height={300}>
					<PieChart>
						<Pie
							data={chartData}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							innerRadius={60}
							outerRadius={80}
							paddingAngle={2}
						>
							{chartData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
							<Label
								content={({ viewBox }) => {
									if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
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
				</ResponsiveContainer>
			</div>

			<Legend data={chartData} />
		</div>
	);
};
