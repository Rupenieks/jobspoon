import { TResumeData } from '@redundant/common/src';
import { useMemo } from 'react';

interface HipsterTemplateProps {
	resume: TResumeData;
	pageIndex: number;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
	<h2 className="text-xl font-bold uppercase tracking-wider mb-8">{children}</h2>
);

export const HipsterTemplate = ({ resume, pageIndex }: HipsterTemplateProps) => {
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
		const hasProfileImage = Boolean(resume.profileImage);

		return (
			<div className={`${hasProfileImage ? 'flex gap-8 items-start' : 'text-center'} mb-12`}>
				{resume.profileImage && (
					<div className="w-32 h-32 flex-shrink-0">
						<img
							src={resume.profileImage}
							alt="Profile"
							className="w-full h-full object-cover"
							onError={(e) => {
								e.currentTarget.style.display = 'none';
							}}
							crossOrigin="anonymous"
							loading="eager"
							decoding="sync"
							fetchPriority="high"
						/>
					</div>
				)}
				<div className="space-y-4">
					<h1 className="text-3xl font-bold uppercase tracking-wider">
						{resume.personalInfo.fullName}
					</h1>
					<p className="text-xl uppercase tracking-wide">{resume.personalInfo.positionName}</p>
					{resume.personalInfo.profileBio && (
						<p className="leading-relaxed max-w-2xl">{resume.personalInfo.profileBio}</p>
					)}
				</div>
			</div>
		);
	}, [resume.profileImage, resume.personalInfo]);

	const educationSection = useMemo(() => {
		return (
			<div>
				<SectionTitle>Education</SectionTitle>
				<div className="space-y-4">
					{resume.education?.length && resume.education.length > 0 && (
						<div>
							{resume.education.map((edu, index) => (
								<div key={index} className="space-y-1">
									<h3 className="font-semibold">{edu.university}</h3>
									<p>{edu.degree}</p>
									<p className="text-sm">
										{edu.startDate} - {edu.endDate}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}, [resume.education]);

	const skillsSection = useMemo(() => {
		return (
			<div>
				<SectionTitle>Skills</SectionTitle>
				<div className="space-y-1">
					{resume.skills?.length && resume.skills.length > 0 && (
						<div>
							{resume.skills.map((skill, index) => (
								<div key={index}>{skill}</div>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}, [resume.skills]);

	const experienceSection = useMemo(() => {
		if (!resume.experience?.length) return null;

		return (
			<div>
				<SectionTitle>Work Experience</SectionTitle>
				<div className="relative">
					{/* Progress Line - extend it to cover the full height */}
					<div
						className="absolute left-[7px] top-4 h-[calc(100%-1rem)] w-[2px]"
						style={{ backgroundColor: config.fontColor }}
					/>
					<div className="space-y-12">
						{resume.experience.map((exp, index) => (
							<div key={index} className="relative pl-8">
								{/* Progress Dot */}
								<div
									className="absolute left-0 top-[6px] w-4 h-4 rounded-full z-10"
									style={{
										backgroundColor: config.primaryColor,
										border: `2px solid ${config.fontColor}`,
									}}
								/>
								<div className="space-y-2">
									<h3 className="text-xl font-semibold">{exp.positionTitle}</h3>
									<div className="flex justify-between items-center">
										<p>{exp.company}</p>
										<p className="text-sm">
											{exp.startDate} - {exp.endDate}
										</p>
									</div>
									{exp.contributions && (
										<ul className="list-disc list-inside space-y-2 mt-4">
											{exp.contributions.map((contribution, i) => (
												<li key={i} className="leading-relaxed">
													{contribution}
												</li>
											))}
										</ul>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}, [resume.experience, config.fontColor, config.primaryColor]);

	const renderSection = (sectionType: string) => {
		switch (sectionType) {
			case 'personalInfo':
				return headerSection;
			case 'experience':
				return experienceSection;
			case 'education':
				return educationSection;
			case 'skills':
				return skillsSection;
			default:
				return null;
		}
	};

	const currentPage = resume.pages[pageIndex];

	// Determine which sections go in which column
	const leftColumnTypes = ['education', 'skills'];
	const rightColumnTypes = ['experience'];

	const leftSections = currentPage.sections.filter((section) =>
		leftColumnTypes.includes(section.type)
	);

	const rightSections = currentPage.sections.filter((section) =>
		rightColumnTypes.includes(section.type)
	);

	return (
		<div
			className="min-h-[297mm] w-[210mm] relative"
			style={{
				fontSize: `${config.fontSize}px`,
				fontFamily: config.font,
				color: config.fontColor,
				backgroundColor: config.primaryColor,
			}}
		>
			<div
				className="h-full"
				style={{
					padding: `${config.margin}mm`,
				}}
			>
				{/* Header only shows on first page */}
				{pageIndex === 0 &&
					currentPage.sections.some((s) => s.type === 'personalInfo') &&
					headerSection}

				{/* Two column layout */}
				<div className="grid grid-cols-[1fr_2fr] gap-12">
					{/* Left Column */}
					<div className="space-y-8">
						{leftSections.map((section) => (
							<div key={section.id}>{renderSection(section.type)}</div>
						))}
					</div>

					{/* Right Column */}
					<div className="space-y-8">
						{rightSections.map((section) => (
							<div key={section.id}>{renderSection(section.type)}</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
