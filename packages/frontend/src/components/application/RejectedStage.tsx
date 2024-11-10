import { Button } from '@/components/ui/button';
import CustomIcon from '@/icons/CustomIcon';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RejectedStage: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col items-center justify-center gap-8 max-w-xl mx-auto text-center">
				{/* Icon and Message */}
				<div className="space-y-6">
					<CustomIcon className="w-32 h-32 text-blue-500 mx-auto" name="reflection" />
					<div className="space-y-2">
						<h2 className="text-2xl font-semibold text-gray-900">
							It's fine, most job applications end in rejection
						</h2>
						<p className="text-lg text-muted-foreground">
							Don't stop trying. Each application is a step towards your next opportunity.
						</p>
					</div>
				</div>

				{/* Action Button */}
				<Button onClick={() => navigate('/matches')} size="lg" className="gap-2">
					Find more job matches
					<ArrowRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
};

export default RejectedStage;
