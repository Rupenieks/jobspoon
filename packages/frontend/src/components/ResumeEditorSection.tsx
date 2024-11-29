import { AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface ResumeEditorSectionProps {
	title: string;
	children: React.ReactNode;
	value: string;
}

const ResumeEditorSection = ({ title, children, value }: ResumeEditorSectionProps) => {
	return (
		<AccordionItem value={value}>
			<AccordionTrigger className="border-1 text-lg rounded-md h-12 px-4 py-2 bg-background hover:bg-muted">
				{title}
			</AccordionTrigger>
			<AccordionContent>
				<div className="space-y-4 p-2">{children}</div>
			</AccordionContent>
		</AccordionItem>
	);
};

export default ResumeEditorSection;
