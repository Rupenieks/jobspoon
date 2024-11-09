import { useProcessResume } from '@/hooks/useProcessResume';
import { TResume } from '@redundant/common/src';
import { useState, useCallback, useMemo } from 'react';
import { Page, Document } from 'react-pdf';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Dashboard = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [numPages, setNumPages] = useState<number | null>(null);
	const [processedResume, setProcessedResume] = useState<TResume | null>(null);

	const { mutate: processResume, isPending } = useProcessResume();

	const handleFileUpload = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (file) {
				setSelectedFile(file);
				processResume(
					{ type: 'file', content: file },
					{
						onSuccess: (data: TResume) => {
							setProcessedResume(data);
						},
						onError: (error) => {
							console.error('Error processing resume:', error);
							setProcessedResume(null);
						},
					}
				);
			}
		},
		[processResume]
	);

	const handleUploadClick = useCallback(() => {
		document.getElementById('fileInput')?.click();
	}, []);

	const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
		setNumPages(numPages);
	}, []);

	const ResumeUploader = useMemo(() => {
		return (
			<div className="space-y-4">
				<h2 className="text-2xl font-bold">Upload Resume</h2>
				<Input
					id="fileInput"
					type="file"
					onChange={handleFileUpload}
					accept=".pdf"
					className="hidden"
				/>
				<Button onClick={handleUploadClick} disabled={isPending}>
					{isPending ? 'Processing...' : 'Select File'}
				</Button>
				{selectedFile && (
					<p className="text-sm text-gray-600">Selected file: {selectedFile.name}</p>
				)}
			</div>
		);
	}, [handleFileUpload, handleUploadClick, isPending, selectedFile]);

	const ResumeViewer = useMemo(() => {
		return (
			<div className="mt-8 flex gap-8">
				<div className="w-1/2">
					<h2 className="text-2xl font-bold mb-4">PDF Viewer</h2>
					<div className="bg-gray-100 h-[calc(100vh-16rem)] overflow-auto">
						{selectedFile ? (
							<Document
								file={selectedFile}
								onLoadSuccess={onDocumentLoadSuccess}
								className="flex flex-col items-center"
							>
								{Array.from(new Array(numPages), (el, index) => (
									<Page
										key={`page_${index + 1}`}
										pageNumber={index + 1}
										width={400}
										className="mb-4"
									/>
								))}
							</Document>
						) : (
							<div className="h-full flex items-center justify-center">
								<p className="text-gray-500">Upload a PDF to view it here</p>
							</div>
						)}
					</div>
				</div>
				<div className="w-1/2">
					<h2 className="text-2xl font-bold mb-4">Processed Resume</h2>
					<div className="bg-gray-100 h-[calc(100vh-16rem)] overflow-auto p-4">
						{processedResume ? (
							<div>
								<h3 className="text-xl font-semibold">{processedResume.fullName}</h3>
								<p>
									{processedResume.email} | {processedResume.phoneNumber}
								</p>
								<p>
									{processedResume.address}, {processedResume.city}, {processedResume.country}
								</p>

								<h4 className="text-lg font-semibold mt-4">Experience</h4>
								{processedResume.experience?.map((exp, index) => (
									<div key={index} className="mb-2">
										<p>
											<strong>{exp.positionTitle}</strong> at {exp.company}
										</p>
										<p>
											{exp.startDate} - {exp.endDate}
										</p>
										<ul className="list-disc list-inside">
											{exp.contributions?.map((contribution, i) => <li key={i}>{contribution}</li>)}
										</ul>
									</div>
								))}

								<h4 className="text-lg font-semibold mt-4">Education</h4>
								{processedResume.education?.map((edu, index) => (
									<div key={index} className="mb-2">
										<p>
											<strong>{edu.degree}</strong> at {edu.university}
										</p>
										<p>
											{edu.startDate} - {edu.endDate}
										</p>
									</div>
								))}

								<h4 className="text-lg font-semibold mt-4">Skills</h4>
								<ul className="list-disc list-inside">
									{processedResume.skills?.map((skill, index) => <li key={index}>{skill}</li>)}
								</ul>
							</div>
						) : (
							<p className="text-gray-500">Upload a resume to see the processed data</p>
						)}
					</div>
				</div>
			</div>
		);
	}, [selectedFile, numPages, onDocumentLoadSuccess, processedResume]);

	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">Start</h1>
			{ResumeUploader}
			{ResumeViewer}
		</div>
	);
};

export default Dashboard;
