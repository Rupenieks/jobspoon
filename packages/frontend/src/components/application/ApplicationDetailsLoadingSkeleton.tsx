import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

const LoadingSkeleton = () => (
	<div className="container mx-auto p-4 space-y-8">
		{/* Back Button Skeleton */}
		<Skeleton className="w-40 h-10" />

		{/* Job Information Section Skeleton */}
		<div className="bg-white shadow-md rounded-lg p-6">
			<div className="space-y-4">
				<div className="flex justify-between items-start">
					<div className="space-y-2">
						<Skeleton className="w-64 h-8" /> {/* Job Title */}
						<div className="space-y-1">
							<Skeleton className="w-48 h-4" /> {/* Company Name */}
							<Skeleton className="w-40 h-4" /> {/* Location */}
						</div>
					</div>
					<Skeleton className="w-32 h-4" /> {/* Posted Date */}
				</div>

				{/* Job Description Skeleton */}
				<div className="border rounded-lg p-4">
					<Skeleton className="w-40 h-5 mb-2" /> {/* Description Header */}
					<div className="space-y-2">
						<Skeleton className="w-full h-4" />
						<Skeleton className="w-full h-4" />
						<Skeleton className="w-3/4 h-4" />
					</div>
				</div>
			</div>
		</div>

		<Separator />

		{/* Resume Editor Section Skeleton */}
		<div className="bg-white shadow-md rounded-lg p-6">
			<Skeleton className="w-32 h-6 mb-4" /> {/* Resume Header */}
			<div className="space-y-4">
				<Skeleton className="w-full h-[400px]" /> {/* Resume Editor */}
			</div>
		</div>

		<Separator />

		{/* Application Details Section Skeleton */}
		<div className="grid grid-cols-2 gap-6">
			<div className="space-y-2">
				<Skeleton className="w-40 h-6" /> {/* Notes Header */}
				<Skeleton className="w-full h-[150px]" /> {/* Notes Textarea */}
			</div>

			<div className="space-y-2">
				<Skeleton className="w-40 h-6" /> {/* Status Header */}
				<Skeleton className="w-full h-10" /> {/* Status Select */}
			</div>
		</div>
	</div>
);

export default LoadingSkeleton;
