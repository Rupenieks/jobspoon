import { Button, Heading, Text, Tailwind } from '@react-email/components';
import { BaseEmailLayout } from './layouts/BaseEmailLayout';

interface WelcomeEmailProps {
	fullName: string;
	loginUrl?: string;
}

export const WelcomeEmail = ({
	fullName,
	loginUrl = 'https://jobspoon.app.io',
}: WelcomeEmailProps) => {
	return (
		<BaseEmailLayout previewText="Welcome to JobSpoon - Your AI-Powered Job Search Assistant">
			<Heading className="text-3xl font-bold text-gray-900 text-center mb-6">
				Welcome to Jobspoon
			</Heading>

			<Text className="text-gray-600 text-lg mb-6">Hi {fullName},</Text>

			<Text className="text-gray-600 mb-8">
				Thank you for joining JobSpoon! We're excited to help you streamline your job search and
				land your dream position.
			</Text>

			<div className="mb-8">
				<Heading className="text-xl font-semibold text-gray-800 mb-4">
					Here's what you can do with Jobspoon:
				</Heading>

				<ul className="space-y-3 text-gray-600">
					<li className="flex items-start">
						<span className="text-brand-primary mr-2">•</span>
						<span>
							<strong>Professional Resume Maker:</strong> Create stunning, ATS-friendly resumes with
							our intuitive builder
						</span>
					</li>
					<li className="flex items-start">
						<span className="text-brand-primary mr-2">•</span>
						<span>
							<strong>AI-Powered Resume Editor:</strong> Get intelligent suggestions to optimize
							your resume for each job
						</span>
					</li>
					<li className="flex items-start">
						<span className="text-brand-primary mr-2">•</span>
						<span>
							<strong>Smart Job Search:</strong> Find relevant positions across LinkedIn, Indeed,
							and more, tailored to your resume
						</span>
					</li>
					<li className="flex items-start">
						<span className="text-brand-primary mr-2">•</span>
						<span>
							<strong>Application Tracking:</strong> Monitor your applications and get interview
							insights and assistance
						</span>
					</li>
				</ul>
			</div>

			<div className="bg-gray-50 p-4 rounded-lg mb-8">
				<Text className="text-gray-600 text-sm">
					<strong>Trial Period Benefits:</strong> Your account includes 3 job runs per day, 1 per
					resume. Upgrade anytime to unlock unlimited access.
				</Text>
			</div>

			<div className="text-center">
				<Button
					className="bg-brand-primary text-white px-8 py-4 rounded-md font-medium text-base hover:bg-brand-secondary"
					href={loginUrl}
				>
					Get Started Now
				</Button>
			</div>

			<Text className="text-gray-500 text-sm text-center mt-8">
				Need help? Reply to this email or contact our support team.
			</Text>
		</BaseEmailLayout>
	);
};

export default WelcomeEmail;
