import CustomIcon from '@/icons/CustomIcon';
import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

const SuccessStage: React.FC = () => {
	const navigate = useNavigate();
	const [showConfetti, setShowConfetti] = useState(true);

	useEffect(() => {
		// Stop confetti after 5 seconds
		const timer = setTimeout(() => {
			setShowConfetti(false);
		}, 5000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="container mx-auto p-4 relative">
			{showConfetti && (
				<ReactConfetti
					width={window.innerWidth}
					height={window.innerHeight}
					recycle={true}
					numberOfPieces={200}
					gravity={0.2}
					initialVelocityY={20}
					colors={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']}
				/>
			)}

			<div className="flex flex-col items-center justify-center gap-8 max-w-xl mx-auto text-center">
				<div className="space-y-6">
					<CustomIcon className="w-32 h-32 text-success mx-auto" name="astronaut" />
					<div className="space-y-2">
						<h2 className="text-2xl font-semibold text-success">
							Congratulations on Your New Job!
						</h2>
						<p className="text-lg text-muted-foreground">
							This is a huge achievement. We're excited to see you take this next step in your
							career!
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SuccessStage;
