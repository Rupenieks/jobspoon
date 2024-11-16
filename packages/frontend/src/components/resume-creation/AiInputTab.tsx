import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Info } from 'lucide-react';

interface AiInputTabProps {
	onSubmit: (text: string) => void;
	isPending: boolean;
}

export const AiInputTab = ({ onSubmit, isPending }: AiInputTabProps) => {
	const [text, setText] = useState('');

	const isSubmitDisabled = useMemo(() => !text.trim(), [text]);

	return (
		<div className="h-full flex flex-col justify-between">
			<Textarea
				placeholder="Paste your resume text here..."
				className="h-[300px] resize-none"
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<div className="flex justify-between gap-4">
				<Alert variant="info" className="bg-blue-500/10 border-blue-500/20">
					<Info className="h-4 w-4" />
					<AlertTitle>Any level of detail</AlertTitle>
					<AlertDescription>
						You can be as detailed or as general as you want. We will use AI to convert it into a
						suitable format for our own resumes.
					</AlertDescription>
				</Alert>
				<div className="flex flex-col justify-end">
					<Button onClick={() => onSubmit(text)} disabled={isSubmitDisabled || isPending}>
						Create Resume
					</Button>
				</div>
			</div>
		</div>
	);
};
