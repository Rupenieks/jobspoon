import { useDownloadPDF } from '@/hooks/useDownloadPDF';
import { TResumeConfig } from '@redundant/common/src';
import { Download, FileText, Layout, Maximize, Minimize2, Palette, Type } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import AutomatedResumeEditor from '../AutomatedResumeEditor';
import ResumeEditor from '../ResumeEditor';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import ResumePreviewFrame from './ResumePreviewFrame';
import { useResumeState } from './ResumeStateContext';
import { MarginIcon } from '@radix-ui/react-icons';

const UtilityBar = ({
	isFullScreen,
	onToggleFullScreen,
}: {
	isFullScreen: boolean;
	onToggleFullScreen: () => void;
}) => {
	const { resume, updateResumeField } = useResumeState();
	const { downloadPDF, isLoading } = useDownloadPDF({
		resumeId: resume?.id,
	});

	const availableFonts = useMemo(
		() => [
			'Roboto',
			'Open Sans',
			'Lato',
			'Montserrat',
			'Source Sans Pro',
			'Poppins',
			'Raleway',
			'Ubuntu',
			'Merriweather',
			'Playfair Display',
			'Nunito',
			'Quicksand',
			'Work Sans',
			'PT Sans',
			'Noto Sans',
			'Rubik',
			'Inter',
			'Mulish',
			'Fira Sans',
			'Oswald',
		],
		[]
	);

	const updateConfig = useCallback(
		(key: keyof TResumeConfig, value: any) => {
			if (!resume) return;
			updateResumeField('config', {
				...resume.data.config,
				[key]: value,
			});
		},
		[resume?.data.config, updateResumeField]
	);

	const updatePages = useCallback(
		(newPageCount: number) => {
			if (!resume) return;
			const currentPages = resume.data.pages.length;

			if (newPageCount > currentPages) {
				const newPages = Array.from({ length: newPageCount - currentPages }).map(() => ({
					sections: [],
				}));
				updateResumeField('pages', [...resume.data.pages, ...newPages]);
			} else if (newPageCount < currentPages) {
				updateResumeField('pages', resume.data.pages.slice(0, newPageCount));
			}
		},
		[resume?.data.pages, updateResumeField]
	);

	if (!resume) return null;

	return (
		<div className="flex items-center justify-between p-2 border-b">
			<div className="flex items-center gap-2">
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="ghost" size="icon">
							<Palette className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent side="top" align="start" className="w-40 z-50">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label className="text-xs font-medium">Primary Color</label>
								<Input
									type="color"
									value={resume.data.config.primaryColor}
									onChange={(e) => updateConfig('primaryColor', e.target.value)}
									className="w-6 h-6 p-0"
								/>
							</div>
							<div className="flex items-center justify-between">
								<label className="text-xs font-medium">Font Color</label>
								<Input
									type="color"
									value={resume.data.config.fontColor}
									onChange={(e) => updateConfig('fontColor', e.target.value)}
									className="w-6 h-6 p-0"
								/>
							</div>
							<div className="flex items-center justify-between">
								<label className="text-xs font-medium">Sidebar Color</label>
								<Input
									type="color"
									value={resume.data.config.sidebarColor}
									onChange={(e) => updateConfig('sidebarColor', e.target.value)}
									className="w-6 h-6 p-0"
								/>
							</div>
							<div className="flex items-center justify-between">
								<label className="text-xs font-medium">Sidebar Font</label>
								<Input
									type="color"
									value={resume.data.config.sidebarFontColor}
									onChange={(e) => updateConfig('sidebarFontColor', e.target.value)}
									className="w-6 h-6 p-0"
								/>
							</div>
						</div>
					</PopoverContent>
				</Popover>

				<Popover>
					<PopoverTrigger asChild>
						<Button variant="ghost" size="icon">
							<Type className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent side="top" className="w-64">
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium">Font Size</label>
								<div className="flex gap-2">
									<Slider
										value={[resume.data.config.fontSize]}
										onValueChange={([value]) => updateConfig('fontSize', value)}
										min={12}
										max={24}
										step={1}
										className="flex-grow"
									/>
									<Input
										type="number"
										value={resume.data.config.fontSize}
										onChange={(e) => updateConfig('fontSize', Number(e.target.value))}
										className="w-16"
									/>
								</div>
							</div>
							<div>
								<label className="text-sm font-medium">Font Family</label>
								<Select
									value={resume.data.config.font}
									onValueChange={(value) => updateConfig('font', value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a font" />
									</SelectTrigger>
									<SelectContent>
										{availableFonts.map((font) => (
											<SelectItem key={font} value={font}>
												{font}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</PopoverContent>
				</Popover>

				<Popover>
					<PopoverTrigger asChild>
						<Button variant="ghost" size="icon">
							<MarginIcon className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent side="top" className="w-64">
						<div className="space-y-2">
							<label className="text-sm font-medium">Margin (mm)</label>
							<div className="flex gap-2">
								<Slider
									value={[resume.data.config.margin]}
									onValueChange={([value]) => updateConfig('margin', value)}
									min={0}
									max={12}
									step={0.1}
									className="flex-grow"
								/>
								<Input
									type="number"
									value={resume.data.config.margin}
									onChange={(e) => updateConfig('margin', Number(e.target.value))}
									className="w-16"
								/>
							</div>
						</div>
					</PopoverContent>
				</Popover>

				<Popover>
					<PopoverTrigger asChild>
						<Button variant="ghost" size="icon">
							<FileText className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent side="top" className="w-64">
						<div className="space-y-2">
							<label className="text-sm font-medium">Number of Pages</label>
							<Input
								type="number"
								value={resume.data.pages.length}
								onChange={(e) => {
									const value = Math.max(1, Number(e.target.value));
									updatePages(value);
								}}
								min={1}
								max={3}
								className="w-full"
							/>
						</div>
					</PopoverContent>
				</Popover>

				<Popover>
					<PopoverTrigger asChild>
						<Button variant="ghost" size="icon">
							<Layout className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent side="top" className="w-64">
						<div className="space-y-2">
							<label className="text-sm font-medium">Template Style</label>
							<Select
								value={resume.data.config.template}
								onValueChange={(value) => updateConfig('template', value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a template" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="standard">Standard</SelectItem>
									<SelectItem value="modern">Modern</SelectItem>
									<SelectItem value="fineprint">Fineprint</SelectItem>
									<SelectItem value="hipster">Hipster</SelectItem>
									<SelectItem value="opus">Opus</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</PopoverContent>
				</Popover>
			</div>

			<div className="flex items-center gap-2">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" onClick={onToggleFullScreen}>
								{isFullScreen ? (
									<Minimize2 className="h-4 w-4" />
								) : (
									<Maximize className="h-4 w-4" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>{isFullScreen ? 'Exit Full Screen' : 'Full Screen'}</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								onClick={downloadPDF}
								disabled={isLoading || !resume?.id}
							>
								<Download className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Download PDF</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
};

const ResumeContent = ({
	isFullScreen = false,
	onToggleFullScreen,
}: {
	isFullScreen: boolean;
	onToggleFullScreen: () => void;
}) => {
	return (
		<div className="flex gap-6 min-h-screen">
			<div className={`${isFullScreen ? 'w-1/3' : 'w-1/2'} overflow-y-auto p-1`}>
				<Tabs defaultValue="manual" className="sticky top-0">
					<TabsList>
						<TabsTrigger value="manual">Manual</TabsTrigger>
						<TabsTrigger value="automated">Automated</TabsTrigger>
					</TabsList>
					<TabsContent value="manual">
						<ResumeEditor />
					</TabsContent>
					<TabsContent value="automated">
						<AutomatedResumeEditor />
					</TabsContent>
				</Tabs>
			</div>
			<div className={`${isFullScreen ? 'w-2/3' : 'w-1/2'} sticky top-0 bg-background z-10`}>
				<div className="sticky top-0">
					<UtilityBar isFullScreen={isFullScreen} onToggleFullScreen={onToggleFullScreen} />
				</div>
				<div className="max-h-[632px] h-full sticky top-[49px]">
					<ResumePreviewFrame />
				</div>
			</div>
		</div>
	);
};

const ResumeEditingWrapper = () => {
	const [isFullScreen, setIsFullScreen] = useState(false);

	const content = (
		<ResumeContent
			isFullScreen={isFullScreen}
			onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
		/>
	);

	if (isFullScreen) {
		return (
			<Dialog open={true} onOpenChange={() => setIsFullScreen(false)}>
				<DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh]">
					<div className="pt-6">{content}</div>
				</DialogContent>
			</Dialog>
		);
	}

	return content;
};

export default ResumeEditingWrapper;
