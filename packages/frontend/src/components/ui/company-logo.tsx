const CompanyLogo = ({ domain }: { domain: string }) => {
	return (
		<img
			src={`https://cdn.brandfetch.io/${domain}/w/24/h/24?c=1id-oSFsbFmt110EbV7`}
			alt={domain}
			className="rounded-sm h-6 w-6"
		/>
	);
};

export default CompanyLogo;
