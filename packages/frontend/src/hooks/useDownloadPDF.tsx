import { useState, useCallback } from 'react';
import axiosInstance from '@/utils/axiosConfig';

interface UseDownloadPDFProps {
	resumeId?: string;
}

export const useDownloadPDF = ({ resumeId }: UseDownloadPDFProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const downloadPDF = useCallback(async () => {
		if (!resumeId) {
			setError('No resume ID provided');
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			// Get the signed URL from your backend
			const response = await axiosInstance.get(`/pdf/${resumeId}`);
			const signedUrl = response.data;

			// Create a hidden anchor element
			const link = document.createElement('a');
			link.href = signedUrl;
			link.target = '_blank'; // Optional: opens in new tab
			link.rel = 'noopener noreferrer'; // Security best practice
			link.download = 'resume.pdf'; // Suggested filename

			// Trigger the download
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to download PDF');
			console.error('Failed to download PDF:', err);
		} finally {
			setIsLoading(false);
		}
	}, [resumeId]);

	return {
		downloadPDF,
		isLoading,
		error,
	};
};
