import { cn } from '@/lib/utils';

const CompanyLogo = ({
	domain,
	className,
	width = 24,
	height = 24,
}: {
	domain: string;
	className?: string;
	width?: number;
	height?: number;
}) => {
	return (
		<img
			src={`https://cdn.brandfetch.io/${domain}/w/${width}/h/${height}?c=1id-oSFsbFmt110EbV7`}
			alt={domain}
			className={cn('rounded-sm ', className)}
		/>
	);
};

export default CompanyLogo;
