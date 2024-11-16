import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Document, Page } from 'react-pdf';
import { useState, useCallback } from 'react';

interface PdfUploadTabProps {
	onSubmit: (file: File) => void;
	isPending: boolean;
}

export const PdfUploadTab = ({ onSubmit, isPending }: PdfUploadTabProps) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [numPages, setNumPages] = useState<number | null>(null);

	const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	}, []);

	const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
		setNumPages(numPages);
	}, []);

	return (
		<div className="flex flex-col justify-between h-full">
			<div className="flex flex-col">
				<Input type="file" accept=".pdf" onChange={handleFileUpload} className="mb-4" />
				{selectedFile && (
					<div className="mt-4">
						<Document
							file={selectedFile}
							onLoadSuccess={onDocumentLoadSuccess}
							className="flex flex-col items-center"
						>
							{Array.from(new Array(numPages), (el, index) => (
								<Page
									key={`page_${index + 1}`}
									pageNumber={index + 1}
									width={300}
									className="mb-4"
								/>
							))}
						</Document>
					</div>
				)}
			</div>

			<div className="flex justify-end p-4">
				<Button
					onClick={() => selectedFile && onSubmit(selectedFile)}
					disabled={!selectedFile || isPending}
				>
					Submit
				</Button>
			</div>
		</div>
	);
};
