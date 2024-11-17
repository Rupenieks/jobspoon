import { Container, Html, Tailwind } from '@react-email/components';
import React from 'react';

interface BaseEmailLayoutProps {
	children: React.ReactNode;
	previewText: string;
}

export const BaseEmailLayout = ({ children, previewText }: BaseEmailLayoutProps) => {
	return (
		<Tailwind
			config={{
				theme: {
					extend: {
						colors: {
							brand: {
								primary: '#2563eb',
								secondary: '#1d4ed8',
							},
						},
					},
				},
			}}
		>
			<Html>
				<Container>{children}</Container>
			</Html>
		</Tailwind>
	);
};
