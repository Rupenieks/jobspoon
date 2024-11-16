import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProcessResume } from '@/hooks/useProcessResume';
import { useCreateResume } from '@/hooks/useCreateResume';
import CustomColorRing from './loaders/ColorRing';
import { ManualInputTab } from './resume-creation/ManualInputTab';
import { PdfUploadTab } from './resume-creation/PdfUploadTab';
import { AiInputTab } from './resume-creation/AiInputTab';
import { useMemo } from 'react';

interface CreateResumeDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

const CreateResumeDialog: React.FC<CreateResumeDialogProps> = ({ isOpen, onOpenChange }) => {
	const { mutate: processResume, isPending: isProcessing } = useProcessResume();
	const { mutate: createResume, isPending: isCreating } = useCreateResume();

	const colorRingColors = useMemo(() => ['#2a86db', '#a9e0f', '#e6ac16', '#2a86db', '#2a86db'], []);

	const handleManualSubmit = (data: {
		positionTitle: string;
		country: string;
		city: string;
		skills: string[];
	}) => {
		createResume(data, {
			onSuccess: () => {
				onOpenChange(false);
			},
		});
	};

	const handleFileSubmit = (file: File) => {
		processResume(
			{ type: 'file', content: file },
			{
				onSuccess: () => {
					onOpenChange(false);
				},
			}
		);
	};

	const handleTextSubmit = (text: string) => {
		processResume(
			{ type: 'text', content: text },
			{
				onSuccess: () => {
					onOpenChange(false);
				},
			}
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="w-full max-w-3xl flex flex-col h-[600px]">
				<DialogHeader className="flex-shrink-0">
					<h2 className="text-lg font-semibold">Create New Resume</h2>
				</DialogHeader>

				{isProcessing || isCreating ? (
					<div className="flex-1 flex justify-center items-center">
						<CustomColorRing colors={colorRingColors as [string, string, string, string, string]} />
					</div>
				) : (
					<Tabs defaultValue="manual" className="flex-1 flex flex-col">
						<TabsList className="flex-shrink-0">
							<TabsTrigger value="manual">Manual Input</TabsTrigger>
							<TabsTrigger value="upload">Upload PDF</TabsTrigger>
							<TabsTrigger value="text">use AI</TabsTrigger>
						</TabsList>
						<div className="flex-1">
							<TabsContent value="manual" className="h-full">
								<ManualInputTab onSubmit={handleManualSubmit} isPending={isCreating} />
							</TabsContent>
							<TabsContent value="upload" className="h-full">
								<PdfUploadTab onSubmit={handleFileSubmit} isPending={isProcessing} />
							</TabsContent>
							<TabsContent value="text" className="h-full">
								<AiInputTab onSubmit={handleTextSubmit} isPending={isProcessing} />
							</TabsContent>
						</div>
					</Tabs>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default CreateResumeDialog;
