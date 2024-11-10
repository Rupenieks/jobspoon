import React from 'react';
import WaitingIcon from './svg/waiting.svg?react';

// Define all possible icon names
export type IconName = 'waiting';

// Map icon names to their components
const iconMap: Record<IconName, React.FC<React.SVGProps<SVGSVGElement>>> = {
	waiting: WaitingIcon,
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
