import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateResumeImages } from '@/hooks/useUpdateResumeImages';
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, TrashIcon, Plus } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { useResumeState } from './resumes/ResumeStateContext';
import { SectionLayoutManager } from './SectionLayoutManager';
import { TEducation, TExperience, TResumeBase, TResumeData } from '@redundant/common/src';
import { cn } from '@/lib/utils';
import ResumeEditorSection from './ResumeEditorSection';

interface SortableExperienceItemProps {
	experience: TExperience;
	index: number;
	updateExperience: (index: number, field: keyof TExperience, value: any) => void;
}

const SortableExperienceItem = ({
	experience,
	index,
	updateExperience,
}: SortableExperienceItemProps) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: index.toString(),
	});

	const style = useMemo(
		() => ({
			transform: CSS.Transform.toString(transform),
			transition,
		}),
		[transform, transition]
	);

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				'mb-6 p-4 border rounded-lg transition-colors relative',
				isDragging
					? [
							'border-primary/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
							'opacity-80 z-50 bg-white shadow-lg',
						]
					: ['bg-background border-border hover:border-primary/50', 'opacity-100 z-0']
			)}
		>
			<div className="flex items-center gap-2 mb-2">
				<button
					{...attributes}
					{...listeners}
					className="cursor-grab hover:bg-gray-100 p-1 rounded"
				>
					<GripVertical className="h-4 w-4 text-gray-400" />
				</button>
				<Input
					placeholder="Position Title"
					value={experience.positionTitle || ''}
					onChange={(e) => updateExperience(index, 'positionTitle', e.target.value)}
				/>
			</div>
			<Input
				className="mb-2"
				placeholder="Company"
				value={experience.company || ''}
				onChange={(e) => updateExperience(index, 'company', e.target.value)}
			/>
			<div className="grid grid-cols-2 gap-2 mb-2">
				<Input
					placeholder="Start Date"
					value={experience.startDate || ''}
					onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
				/>
				<Input
					placeholder="End Date"
					value={experience.endDate || ''}
					onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
				/>
			</div>
			{experience.contributions?.map((contribution, contIndex) => (
				<div key={contIndex} className="flex gap-2 mb-2">
					<Input
						value={contribution}
						onChange={(e) =>
							updateExperience(index, 'contributions', [
								...(experience.contributions?.slice(0, contIndex) || []),
								e.target.value,
								...(experience.contributions?.slice(contIndex + 1) || []),
							])
						}
						placeholder="Contribution"
					/>
					<Button
						variant="ghost"
						size="icon"
						onClick={() =>
							updateExperience(index, 'contributions', [
								...(experience.contributions?.slice(0, contIndex) || []),
								...(experience.contributions?.slice(contIndex + 1) || []),
							])
						}
					>
						<TrashIcon className="h-4 w-4" />
					</Button>
				</div>
			))}
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					updateExperience(index, 'contributions', [...(experience.contributions || []), ''])
				}
			>
				Add Contribution
			</Button>
		</div>
	);
};

// Sortable Education Item Component
const SortableEducationItem = ({
	education,
	index,
	updateEducation,
	updateResumeField,
	resume,
}: {
	education: TEducation;
	index: number;
	updateEducation: (index: number, field: keyof TEducation, value: any) => void;
	updateResumeField: <K extends keyof TResumeData>(field: K, value: TResumeData[K]) => void;
	resume: TResumeBase | null;
}) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: index.toString(),
	});

	const style = useMemo(
		() => ({
			transform: CSS.Transform.toString(transform),
			transition,
		}),
		[transform, transition]
	);

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				'mb-6 p-4 border rounded-lg transition-colors relative',
				isDragging
					? [
							'border-primary/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
							'opacity-80 z-50 bg-white shadow-lg',
						]
					: ['bg-background border-border hover:border-primary/50', 'opacity-100 z-0']
			)}
		>
			<div className="flex items-center gap-2 mb-2">
				<button
					{...attributes}
					{...listeners}
					className="cursor-grab hover:bg-gray-100 p-1 rounded"
				>
					<GripVertical className="h-4 w-4 text-gray-400" />
				</button>
				<Input
					placeholder="University"
					value={education.university || ''}
					onChange={(e) => updateEducation(index, 'university', e.target.value)}
				/>
				<Button
					variant="ghost"
					size="icon"
					onClick={() =>
						updateResumeField(
							'education',
							resume?.data.education?.filter((_, i) => i !== index) || []
						)
					}
				>
					<TrashIcon className="h-4 w-4" />
				</Button>
			</div>
			<Input
				className="mb-2"
				placeholder="Degree"
				value={education.degree || ''}
				onChange={(e) => updateEducation(index, 'degree', e.target.value)}
			/>
			<div className="grid grid-cols-2 gap-2">
				<Input
					placeholder="Start Date"
					value={education.startDate || ''}
					onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
				/>
				<Input
					placeholder="End Date"
					value={education.endDate || ''}
					onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
				/>
			</div>
		</div>
	);
};

const ResumeEditor: React.FC = () => {
	const {
		resume,
		updateResumeField,
		updateExperience,
		updateEducation,
		addExperience,
		addEducation,
		updateSkill,
		addSkill,
	} = useResumeState();

	const { mutate: updateResumeImages } = useUpdateResumeImages();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleExperienceDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			const oldIndex = parseInt(active.id as string, 10);
			const newIndex = parseInt(over.id as string, 10);
			const newExperience = arrayMove(resume?.data.experience || [], oldIndex, newIndex);
			updateResumeField('experience', newExperience);
		}
	};

	const handleEducationDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			const oldIndex = parseInt(active.id as string, 10);
			const newIndex = parseInt(over.id as string, 10);
			const newEducation = arrayMove(resume?.data.education || [], oldIndex, newIndex);
			updateResumeField('education', newEducation);
		}
	};

	const personalInfoFields = useMemo(
		() => [
			{ label: 'Full Name', field: 'fullName' as const },
			{ label: 'Email', field: 'email' as const },
			{ label: 'Phone Number', field: 'phoneNumber' as const },
			{ label: 'Address', field: 'address' as const },
			{ label: 'City', field: 'city' as const },
			{ label: 'Country', field: 'country' as const },
			{ label: 'Position Name', field: 'positionName' as const },
		],
		[]
	);

	const handleProfileImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && resume) {
			updateResumeImages({
				id: resume?.id,
				profileImage: file,
			});
		}
	}, []);

	const updatePersonalInfo = useCallback(
		(field: string, value: string) => {
			if (!resume) return;
			updateResumeField('personalInfo', {
				...resume.data.personalInfo,
				[field]: value,
			});
		},
		[resume?.data.personalInfo, updateResumeField]
	);

	if (!resume) {
		return null;
	}

	return (
		<Accordion type="multiple" className="w-full flex flex-col">
			<ResumeEditorSection title="Personal Information" value="personal-info">
				<div>
					<label className="block text-sm font-medium mb-1">Profile Bio</label>
					<Textarea
						value={resume.data.personalInfo.profileBio || ''}
						onChange={(e) => updatePersonalInfo('profileBio', e.target.value)}
						placeholder="Write a brief bio about yourself..."
						className="h-32"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					{personalInfoFields.map(({ label, field }) => (
						<div key={field}>
							<label className="block text-sm font-medium mb-1">{label}</label>
							<Input
								value={resume.data.personalInfo[field] || ''}
								onChange={(e) => updatePersonalInfo(field, e.target.value)}
							/>
						</div>
					))}
					<div>
						<label>Profile Image</label>
						<Input type="file" onChange={handleProfileImageUpload} />
					</div>
				</div>
			</ResumeEditorSection>

			<ResumeEditorSection title="Experience" value="experience">
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleExperienceDragEnd}
					modifiers={[restrictToVerticalAxis]}
				>
					<SortableContext
						items={resume.data.experience?.map((_, i) => i.toString()) || []}
						strategy={verticalListSortingStrategy}
					>
						{resume.data.experience?.map((exp, index) => (
							<SortableExperienceItem
								key={index}
								experience={exp}
								index={index}
								updateExperience={(index: number, field: keyof TExperience, value: any) =>
									updateExperience(index, field, value)
								}
							/>
						))}
					</SortableContext>
				</DndContext>
				<Button onClick={addExperience} size="icon" variant="outline">
					<Plus className="h-4 w-4" />
				</Button>
			</ResumeEditorSection>

			<ResumeEditorSection title="Education" value="education">
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleEducationDragEnd}
					modifiers={[restrictToVerticalAxis]}
				>
					<SortableContext
						items={resume.data.education?.map((_, i) => i.toString()) || []}
						strategy={verticalListSortingStrategy}
					>
						{resume.data.education?.map((edu, index) => (
							<SortableEducationItem
								key={index}
								education={edu}
								index={index}
								updateEducation={updateEducation}
								updateResumeField={updateResumeField}
								resume={resume}
							/>
						))}
					</SortableContext>
				</DndContext>
				<Button onClick={addEducation} size="icon" variant="outline">
					<Plus className="h-4 w-4" />
				</Button>
			</ResumeEditorSection>

			<ResumeEditorSection title="Skills" value="skills">
				<div className="grid grid-cols-2 gap-2 mb-2">
					{resume.data.skills?.map((skill, index) => (
						<div key={index} className="flex gap-2 mb-2">
							<Input
								value={skill}
								onChange={(e) => updateSkill(index, e.target.value)}
								placeholder="Skill"
							/>
							<Button
								variant="ghost"
								size="icon"
								onClick={() =>
									updateResumeField(
										'skills',
										resume.data.skills?.filter((_, i) => i !== index) || []
									)
								}
							>
								<TrashIcon className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>
				<Button onClick={addSkill} size="icon" variant="outline">
					<Plus className="h-4 w-4" />
				</Button>
			</ResumeEditorSection>

			<ResumeEditorSection title="Layout" value="layout">
				<SectionLayoutManager />
			</ResumeEditorSection>
		</Accordion>
	);
};

export default ResumeEditor;
