import React from 'react';
// @ts-ignore
import WaitingIcon from './svg/waiting.svg?react';
// @ts-ignore
import ReflectionIcon from './svg/reflection.svg?react';
// @ts-ignore
import InterviewIcon from './svg/interview.svg?react';
// @ts-ignore
import UploadIcon from './svg/upload.svg?react';
// @ts-ignore
import OnlineResumeIcon from './svg/online-resume.svg?react';
// @ts-ignore
import PersonalInfoIcon from './svg/personal-info.svg?react';
// @ts-ignore
import NoDataIcon from './svg/no-data.svg?react';
// @ts-ignore
import CreateIcon from './svg/create.svg?react';
// @ts-ignore
import AstronautIcon from './svg/astronaut.svg?react';
// @ts-ignore
import JobSpooonLogo from './svg/logo.svg?react';
// @ts-ignore
import JobSpoon from './svg/jobspoon.svg?react';
// @ts-ignore
import TodoListIcon from './svg/todo-list.svg?react';

export type IconName =
	| 'waiting'
	| 'reflection'
	| 'interview'
	| 'upload'
	| 'online-resume'
	| 'personal-info'
	| 'no-data'
	| 'create'
	| 'astronaut'
	| 'logo'
	| 'jobspoon'
	| 'todo-list';
// Map icon names to their components
const iconMap: Record<IconName, React.FC<React.SVGProps<SVGSVGElement>>> = {
	waiting: WaitingIcon,
	reflection: ReflectionIcon,
	interview: InterviewIcon,
	upload: UploadIcon,
	'online-resume': OnlineResumeIcon,
	'personal-info': PersonalInfoIcon,
	'no-data': NoDataIcon,
	create: CreateIcon,
	astronaut: AstronautIcon,
	logo: JobSpooonLogo,
	jobspoon: JobSpoon,
	'todo-list': TodoListIcon,
};

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
	name: IconName;
	className?: string;
}

const CustomIcon: React.FC<CustomIconProps> = ({ name, className = '', ...props }) => {
	const Icon = iconMap[name];

	if (!Icon) {
		console.error(`Icon "${name}" not found in icon map`);
		return null;
	}

	return <Icon className={className} {...props} />;
};

export default CustomIcon;
