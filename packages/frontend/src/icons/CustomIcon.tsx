import React from 'react';
// @ts-ignore
import WaitingIcon from './svg/waiting.svg?react';
// @ts-ignore
import ReflectionIcon from './svg/reflection.svg?react';
// @ts-ignore
import InterviewIcon from './svg/interview.svg?react';
// @ts-ignore
import UploadIcon from './svg/upload.svg?react';
// Define all possible icon names
export type IconName = 'waiting' | 'reflection' | 'interview' | 'upload';

// Map icon names to their components
const iconMap: Record<IconName, React.FC<React.SVGProps<SVGSVGElement>>> = {
	waiting: WaitingIcon,
	reflection: ReflectionIcon,
	interview: InterviewIcon,
	upload: UploadIcon,
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
