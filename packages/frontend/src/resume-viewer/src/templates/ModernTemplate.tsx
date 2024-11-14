import { TResumeData } from '@redundant/common/src';
import { useMemo } from 'react';

interface ModernTemplateProps {
	resume: TResumeData;
	pageIndex: number;
}

const SectionTitle = ({ children, color }: { children: React.ReactNode; color: string }) => (
	<div className="space-y-2">
		<h2 className="text-xl font-semibold uppercase tracking-wider">{children}</h2>
		<div className="h-0.5" style={{ backgroundColor: color }} />
	</div>
);

export const ModernTemplate = ({ resume, pageIndex }: ModernTemplateProps) => {
	const config = useMemo(
		() => ({
			...{
				primaryColor: '#ffffff',
				sidebarColor: '#1f2937',
				fontColor: '#000000',
				sidebarFontColor: '#ffffff',
				fontSize: 16,
				font: 'Roboto',
				margin: 25.4,
			},
			...resume.config,
		}),
		[resume.config]
	);

	const profileSection = useMemo(() => {
		return (
			<div className="space-y-6">
				{resume.profileImage && (
					<div className="flex justify-center">
						<div className="w-32 h-32 flex-shrink-0">
							<img
								src={resume.profileImage}
								alt="Profile"
								className="rounded-full w-full h-full object-cover border-4"
								style={{ borderColor: config.sidebarColor }}
								onError={(e) => {
									console.error('Image failed to load:', e);
									e.currentTarget.style.display = 'none';
								}}
								crossOrigin="anonymous"
								loading="eager"
								decoding="sync"
								fetchPriority="high"
							/>
						</div>
					</div>
				)}
				<div className="space-y-4">
					<SectionTitle color={config.primaryColor}>Contact</SectionTitle>
					<div className="space-y-2 break-words">
						{resume.personalInfo.phoneNumber && (
							<div className="flex gap-2 items-center">
								<p>{resume.personalInfo.phoneNumber}</p>
							</div>
						)}
						{resume.personalInfo.email && (
							<div className="flex gap-2 items-center">
								<p className="break-all">{resume.personalInfo.email}</p>
							</div>
						)}
						{resume.personalInfo.address && (
							<div className="flex gap-2 items-center">
								<p>{resume.personalInfo.address}</p>
							</div>
						)}
						{resume.personalInfo.city && <p>{resume.personalInfo.city}</p>}
						{resume.personalInfo.country && <p>{resume.personalInfo.country}</p>}
					</div>
				</div>
			</div>
		);
	}, [resume.personalInfo, resume.profileImage, config.primaryColor, config.sidebarColor]);

	const educationSection = useMemo(() => {
		if (!resume.education?.length) return null;

		return (
			<div className="space-y-6">
				<SectionTitle color={config.primaryColor}>Education</SectionTitle>
				<div className="space-y-4">
					{resume.education.map((edu, index) => (
						<div key={index} className="space-y-1">
							<p className="font-semibold">{edu.university}</p>
							<p>{edu.degree}</p>
							<p className="text-sm">
								{edu.startDate} — {edu.endDate}
							</p>
						</div>
					))}
				</div>
			</div>
		);
	}, [resume.education, config.primaryColor]);

	const skillsSection = useMemo(() => {
		if (!resume.skills?.length) return null;

		return (
			<div className="space-y-6">
				<SectionTitle color={config.primaryColor}>Skills</SectionTitle>
				<div className="space-y-2">
					{resume.skills.map((skill, index) => (
						<p key={index}>{skill}</p>
					))}
				</div>
			</div>
		);
	}, [resume.skills, config.primaryColor]);

	const mainProfileSection = useMemo(() => {
		return (
			<div className="space-y-6">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold uppercase">{resume.personalInfo.fullName}</h1>
					<p className="text-xl uppercase tracking-wider">{resume.personalInfo.positionName}</p>
				</div>
				{resume.personalInfo.profileBio && (
					<div className="space-y-4">
						<SectionTitle color={config.sidebarColor}>Profile</SectionTitle>
						<p className="leading-relaxed">{resume.personalInfo.profileBio}</p>
					</div>
				)}
			</div>
		);
	}, [resume.personalInfo, config.sidebarColor]);

	const experienceSection = useMemo(() => {
		if (!resume.experience?.length) return null;

		return (
			<div className="space-y-6">
				<SectionTitle color={config.sidebarColor}>Work Experience</SectionTitle>
				<div className="space-y-8">
					{resume.experience.map((exp, index) => (
						<div key={index} className="space-y-2">
							<div className="flex justify-between items-start">
								<div>
									<h3 className="font-semibold text-lg">{exp.positionTitle}</h3>
									<p className="text-gray-600">{exp.company}</p>
								</div>
								<p className="text-sm whitespace-nowrap">
									{exp.startDate} — {exp.endDate}
								</p>
							</div>
							{exp.contributions && (
								<ul className="list-disc list-inside space-y-1 ml-4">
									{exp.contributions.map((contribution, i) => (
										<li key={i} className="text-sm">
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
	}, [resume.experience, config.sidebarColor]);

	return (
		<div
			className="flex min-h-[297mm] w-[210mm] relative"
			style={{
				fontSize: `${config.fontSize}px`,
				fontFamily: config.font,
				backgroundColor: config.primaryColor,
			}}
		>
			{/* Left Sidebar */}
			<div className="relative" style={{ width: '70mm', maxWidth: '70mm', minWidth: '70mm' }}>
				<div className="absolute inset-0" style={{ backgroundColor: config.sidebarColor }} />
				<div
					className="relative space-y-8"
					style={{
						margin: `${config.margin}mm`,
						color: config.sidebarFontColor,
					}}
				>
					{profileSection}
					{educationSection}
					{skillsSection}
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-grow">
				<div
					className="space-y-8"
					style={{
						margin: `${config.margin}mm`,
						color: config.fontColor,
					}}
				>
					{mainProfileSection}
					{experienceSection}
				</div>
			</div>
		</div>
	);
};
