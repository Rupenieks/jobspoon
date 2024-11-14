import { TResumeData } from '@redundant/common/src';
import { useMemo } from 'react';

interface OpusTemplateProps {
	resume: TResumeData;
	pageIndex: number;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
	<h2 className="text-lg font-semibold uppercase tracking-wider mb-4">{children}</h2>
);

export const OpusTemplate = ({ resume, pageIndex }: OpusTemplateProps) => {
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
			<div className="space-y-4">
				<h1 className="text-5xl font-bold tracking-wide text-center">
					{resume.personalInfo.fullName}
				</h1>
				<p className="text-xl text-center uppercase tracking-widest">
					{resume.personalInfo.positionName}
				</p>
				<div className="w-full h-px mt-6" style={{ backgroundColor: config.fontColor }} />
			</div>
		);
	}, [resume.personalInfo, config.fontColor]);

	const contactSection = useMemo(() => {
		return (
			<div className="space-y-4">
				<SectionTitle>Contact</SectionTitle>
				<div className="space-y-2">
					{resume.personalInfo.phoneNumber && <p>{resume.personalInfo.phoneNumber}</p>}
					{resume.personalInfo.email && <p className="break-words">{resume.personalInfo.email}</p>}
					{resume.personalInfo.address && <p>{resume.personalInfo.address}</p>}
					{resume.personalInfo.city && <p>{resume.personalInfo.city}</p>}
					{resume.personalInfo.country && <p>{resume.personalInfo.country}</p>}
				</div>
			</div>
		);
	}, [resume.personalInfo]);

	const skillsSection = useMemo(() => {
		if (!resume.skills?.length) return null;

		return (
			<div className="space-y-4">
				<SectionTitle>Skills</SectionTitle>
				<div className="space-y-2">
					{resume.skills.map((skill, index) => (
						<p key={index}>{skill}</p>
					))}
				</div>
			</div>
		);
	}, [resume.skills]);

	const educationSection = useMemo(() => {
		if (!resume.education?.length) return null;

		return (
			<div className="space-y-4">
				<SectionTitle>Education</SectionTitle>
				<div className="space-y-4">
					{resume.education.map((edu, index) => (
						<div key={index} className="space-y-1">
							<p className="font-medium">{edu.university}</p>
							<p>{edu.degree}</p>
							<p className="text-sm">
								{edu.startDate} - {edu.endDate}
							</p>
						</div>
					))}
				</div>
			</div>
		);
	}, [resume.education]);

	const experienceSection = useMemo(() => {
		if (!resume.experience?.length) return null;

		return (
			<div className="space-y-8">
				<SectionTitle>Work Experience</SectionTitle>
				<div className="space-y-12">
					{resume.experience.map((exp, index) => (
						<div key={index} className="space-y-4">
							<div>
								<h3 className="font-semibold text-xl mb-1">{exp.positionTitle}</h3>
								<div className="flex justify-between text-sm">
									<span>{exp.company}</span>
									<span>
										{exp.startDate} - {exp.endDate}
									</span>
								</div>
							</div>
							{exp.contributions && (
								<ul className="list-disc list-inside space-y-2">
									{exp.contributions.map((contribution, i) => (
										<li key={i} className="text-sm leading-relaxed">
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
	}, [resume.experience]);

	const renderSection = (sectionType: string) => {
		switch (sectionType) {
			case 'personalInfo':
				return headerSection;
			case 'contact':
				return contactSection;
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

	const sidebarTypes = ['contact', 'skills', 'education'];
	const mainTypes = ['experience'];

	const sidebarSections = currentPage.sections.filter((section) =>
		sidebarTypes.includes(section.type)
	);

	const mainSections = currentPage.sections.filter((section) => mainTypes.includes(section.type));

	return (
		<div
			className="min-h-[297mm] w-[210mm] relative"
			style={{
				fontSize: `${config.fontSize}px`,
				fontFamily: config.font,
				backgroundColor: config.primaryColor,
			}}
		>
			<div className="h-full flex flex-col">
				{/* Header with its own padding, but no bottom padding */}
				{pageIndex === 0 && currentPage.sections.some((s) => s.type === 'personalInfo') && (
					<div
						style={{
							paddingLeft: `${config.margin}mm`,
							paddingRight: `${config.margin}mm`,
							paddingTop: `${config.margin}mm`,
						}}
					>
						{headerSection}
					</div>
				)}

				{/* Two column layout - fills remaining height */}
				<div className="grid grid-cols-[2fr_3fr] flex-grow h-full">
					{/* Left Sidebar */}
					<div
						style={{
							backgroundColor: config.sidebarColor,
							height: '100%',
						}}
					>
						<div
							className="space-y-8"
							style={{
								color: config.sidebarFontColor,
								padding: `${config.margin}mm`,
							}}
						>
							{sidebarSections.map((section) => (
								<div key={section.id}>{renderSection(section.type)}</div>
							))}
						</div>
					</div>

					{/* Main Content */}
					<div
						style={{
							backgroundColor: config.primaryColor,
							height: '100%',
						}}
					>
						<div
							className="space-y-8"
							style={{
								padding: `${config.margin}mm`,
							}}
						>
							{mainSections.map((section) => (
								<div key={section.id}>{renderSection(section.type)}</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
