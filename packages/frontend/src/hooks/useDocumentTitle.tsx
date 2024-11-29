import { useEffect } from 'react';

const useDocumentTitle = (title: string) => {
	useEffect(() => {
		const previousTitle = document.title;
		document.title = title ? `${title} | Jobspoon` : 'Jobspoon';

		return () => {
			document.title = previousTitle;
		};
	}, [title]);
};

export default useDocumentTitle;
