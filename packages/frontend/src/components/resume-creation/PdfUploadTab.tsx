import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Document, Page } from 'react-pdf';
import { useState, useCallback } from 'react';
import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import CustomIcon from '@/icons/CustomIcon';

interface PdfUploadTabProps {
	onSubmit: (file: File) => void;
	isPending: boolean;
}

export const PdfUploadTab = ({ onSubmit, isPending }: PdfUploadTabProps) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	}, []);

	return (
		<div className="flex flex-col justify-between h-full">
			<div className="flex flex-col">
				<Input type="file" accept=".pdf" onChange={handleFileUpload} className="mb-4" />
				<div className="flex items-center justify-center max-h-24"></div>
			</div>
			<div className="flex justify-center items-center">
				<CustomIcon name="upload" className="w-48 h-48" />
			</div>
			<div className="flex">
				<div className="flex justify-between gap-4">
					<Alert variant="info" className="bg-blue-500/10 border-blue-500/20">
						<Info className="h-4 w-4" />
						<AlertTitle>Resume parsing with AI</AlertTitle>
						<AlertDescription>
							We will extract the data from your resume and use AI to convert it into a suitable
							format for our own resumes
						</AlertDescription>
					</Alert>
					<div className="flex flex-col justify-end">
						<Button
							onClick={() => selectedFile && onSubmit(selectedFile)}
							disabled={!selectedFile || isPending}
						>
							Create Resume
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
