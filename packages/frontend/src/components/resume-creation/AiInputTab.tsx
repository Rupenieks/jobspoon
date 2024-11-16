import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useMemo } from 'react';

interface AiInputTabProps {
	onSubmit: (text: string) => void;
	isPending: boolean;
}

export const AiInputTab = ({ onSubmit, isPending }: AiInputTabProps) => {
	const [text, setText] = useState('');

	const isSubmitDisabled = useMemo(() => !text.trim(), [text]);

	return (
		<div className="space-y-4 h-full flex flex-col justify-between">
			<Textarea
				placeholder="Paste your resume text here..."
				className="h-[300px] resize-none"
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<div className="flex justify-end p-4">
				<Button onClick={() => onSubmit(text)} disabled={isSubmitDisabled || isPending}>
					Submit
				</Button>
			</div>
		</div>
	);
};
