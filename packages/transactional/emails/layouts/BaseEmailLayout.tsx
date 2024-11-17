import { Container, Font, Html, Img, Tailwind } from '@react-email/components';
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
				<Font
					fontFamily="Roboto"
					fallbackFontFamily="Verdana"
					webFont={{
						url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
						format: 'woff2',
					}}
					fontWeight={400}
					fontStyle="normal"
				/>
				<Container>
					<Img width={320} height={40} src="static/jobspoon.png" />
					{children}
				</Container>
			</Html>
		</Tailwind>
	);
};
