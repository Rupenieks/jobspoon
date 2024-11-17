import { Button, Heading, Text, Tailwind, Container, Section } from '@react-email/components';
import { BaseEmailLayout } from './layouts/BaseEmailLayout';

interface WelcomeEmailProps {
	fullName: string;
	loginUrl?: string;
}

export const WelcomeEmail = ({
	fullName,
	loginUrl = 'https://jobspoon.com/login',
}: WelcomeEmailProps) => {
	return (
		<BaseEmailLayout previewText="Welcome to JobSpoon - Your Job Search Assistant">
			<Heading className="text-2xl font-bold text-gray-900 text-center">
				Welcome to JobSpoon
			</Heading>
			<Text className="text-gray-600">Hi {fullName},</Text>
			<Text className="text-gray-600">
				We're excited to have you on board! JobSpoon is here to help you find your perfect job match
				and streamline your application process.
			</Text>
			<div className="text-center mt-8">
				<Button
					className="bg-brand-primary text-white px-6 py-3 rounded-md font-medium text-sm hover:bg-brand-secondary"
					href={loginUrl}
				>
					Get Started
				</Button>
			</div>
		</BaseEmailLayout>
	);
};

export default WelcomeEmail;
