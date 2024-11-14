import { TResumeData } from '@redundant/common/src';
import { useMemo } from 'react';

interface FineprintTemplateProps {
	resume: TResumeData;
	pageIndex: number;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
	<div className="w-full border-b border-gray-300 pb-1 mb-4">
		<h2 style={{ fontSize: '1.5em' }} className="font-semibold uppercase tracking-wider">
			{children}
		</h2>
	</div>
);

export const FineprintTemplate = ({ resume, pageIndex }: FineprintTemplateProps) => {
	const config = useMemo(
		() => ({
			...{
				primaryColor: '#ffffff',
				fontColor: '#000000',
				fontSize: 16,
				font: 'Roboto',
				margin: 25.4,
			},
			...resume.config,
		}),
		[resume.config]
	);

	const headerSection = useMemo(() => {
		return (
			<div className="space-y-1 text-center mb-6">
				<h1 style={{ fontSize: '2em' }} className="font-bold uppercase tracking-wider">
					{resume.personalInfo.fullName}
				</h1>
				<div style={{ fontSize: '0.875em' }} className="space-y-1">
					{resume.personalInfo.address && <span>Address: {resume.personalInfo.address}</span>}
					{resume.personalInfo.phoneNumber && <div>Phone: {resume.personalInfo.phoneNumber}</div>}
					{resume.personalInfo.email && <div>Email: {resume.personalInfo.email}</div>}
				</div>
			</div>
		);
	}, [resume.personalInfo]);

	const summarySection = useMemo(() => {
		if (!resume.personalInfo.profileBio) return null;
		return (
			<div className="space-y-4">
				<SectionTitle>Summary</SectionTitle>
				<p style={{ fontSize: '1em' }} className="leading-relaxed">
					{resume.personalInfo.profileBio}
				</p>
			</div>
		);
	}, [resume.personalInfo.profileBio]);

	const experienceSection = useMemo(() => {
		if (!resume.experience?.length) return null;

		return (
			<div className="space-y-4">
				<SectionTitle>Work Experience</SectionTitle>
				<div className="space-y-6">
					{resume.experience.map((exp, index) => (
						<div key={index} className="space-y-2">
							<div className="flex justify-between items-start">
								<div>
									<h3
										style={{
											fontSize: '1.25em',
											color: config.fontColor,
										}}
										className="font-semibold"
									>
										{exp.positionTitle}
									</h3>
									<p
										style={{
											fontSize: '1em',
											color: config.fontColor,
										}}
										className="text-sm"
									>
										{exp.company}
									</p>
								</div>
								<p
									style={{
										fontSize: '1em',
										color: config.fontColor,
									}}
									className="text-sm"
								>
									{exp.startDate} - {exp.endDate}
								</p>
							</div>
							{exp.contributions && (
								<ul className="list-disc list-inside space-y-1">
									{exp.contributions.map((contribution, i) => (
										<li
											key={i}
											style={{
												fontSize: '1em',
												color: config.fontColor,
											}}
										>
											{contribution}
										</li>
									))}
								</ul>
							)}
						</div>
					))}
				</div>
			</div>
		);
	}, [resume.experience, config.fontColor]);

	const educationSection = useMemo(() => {
		if (!resume.education?.length) return null;

		return (
			<div className="space-y-4">
				<SectionTitle>Education</SectionTitle>
				<div className="space-y-4">
					{resume.education.map((edu, index) => (
						<div key={index} className="space-y-1">
							<div className="flex justify-between">
								<h3
									style={{
										fontSize: '1.25em',
										color: config.fontColor,
									}}
									className="font-semibold"
								>
									{edu.university}
								</h3>
								<p
									style={{
										fontSize: '1em',
										color: config.fontColor,
									}}
									className="text-sm"
								>
									{edu.startDate} - {edu.endDate}
								</p>
							</div>
							<p
								style={{
									fontSize: '1em',
									color: config.fontColor,
								}}
								className="text-sm"
							>
								{edu.degree}
							</p>
						</div>
					))}
				</div>
			</div>
		);
	}, [resume.education]);

	const additionalSection = useMemo(() => {
		if (!resume.skills?.length) return null;

		return (
			<div className="space-y-4">
				<SectionTitle>Additional Information</SectionTitle>
				<div className="space-y-2">
					<div>
						<p className="text-sm">
							<strong>Technical Skills:</strong> {resume.skills.join(', ')}
						</p>
					</div>
				</div>
			</div>
		);
	}, [resume.skills]);

	return (
		<div
			className="min-h-[297mm] w-[210mm] relative"
			style={{
				fontSize: `${config.fontSize}px`,
				fontFamily: config.font,
				color: config.fontColor,
				backgroundColor: config.primaryColor,
				margin: 0,
				padding: 0,
				height: '100%',
				minHeight: '297mm',
				pageBreakAfter: 'always',
				pageBreakInside: 'avoid',
			}}
		>
			<div
				className="space-y-6"
				style={{
					padding: `${config.margin}mm`,
				}}
			>
				{headerSection}
				{summarySection}
				{experienceSection}
				{educationSection}
				{additionalSection}
			</div>
		</div>
	);
};
