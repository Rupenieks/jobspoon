import { format } from 'date-fns';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

interface WeeklyApplicationsChartProps {
	data: Array<{ week: string; applications: number }>;
}

const chartConfig = {
	applications: {
		label: 'Applications',
		color: 'hsl(var(--info))',
	},
} satisfies ChartConfig;

export function WeeklyApplicationsChart({ data }: WeeklyApplicationsChartProps) {
	const isIncreasing =
		data.length >= 2 && data[data.length - 1].applications > data[data.length - 2].applications;

	return (
		<Card className="lg:col-span-8">
			<CardHeader>
				<CardTitle>Weekly Applications</CardTitle>
				<CardDescription>
					{data.length > 0
						? `${format(new Date(data[0].week), 'MMMM d')} - ${format(
								new Date(data[data.length - 1].week),
								'MMMM d, yyyy'
							)}`
						: 'No applications yet'}
				</CardDescription>
			</CardHeader>
			<CardContent className="bg-background rounded-md p-6">
				<ChartContainer config={chartConfig}>
					<LineChart
						data={data}
						margin={{
							top: 5,
							right: 10,
							left: 10,
							bottom: 5,
						}}
					>
						<CartesianGrid
							horizontal={true}
							vertical={false}
							stroke="hsl(var(--border))"
							strokeDasharray="4 4"
						/>
						<XAxis
							dataKey="week"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(date) => format(new Date(date), 'MMM d')}
							stroke="hsl(var(--muted-foreground))"
							fontSize={12}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							stroke="hsl(var(--muted-foreground))"
							fontSize={12}
							tickCount={5}
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<Line
							type="monotone"
							dataKey="applications"
							stroke="hsl(var(--info))"
							strokeWidth={2}
							dot={{
								fill: 'hsl(var(--info))',
								r: 4,
							}}
							activeDot={{
								r: 6,
								stroke: 'hsl(var(--info))',
								strokeWidth: 2,
							}}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
			{data.length >= 2 && (
				<CardFooter className="flex-col items-start gap-2 text-sm">
					<div className="flex gap-2 font-medium leading-none">
						Trending {isIncreasing ? 'up' : 'down'} this week
						<TrendingUp
							className={`h-4 w-4 ${isIncreasing ? 'text-success' : 'text-destructive rotate-180'}`}
						/>
					</div>
					<div className="leading-none text-muted-foreground">
						Showing applications for the last {data.length} weeks
					</div>
				</CardFooter>
			)}
		</Card>
	);
}
