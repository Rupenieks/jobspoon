import useDebouncedCallback from '@/hooks/useDebouncedCallback';
import { useReadResume } from '@/hooks/useReadResume';
import { useUpdateResume } from '@/hooks/useUpdateResume';
import { TResumeData, TResumeBase, TEducation, TExperience } from '@redundant/common/src';
import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react';

interface ResumeStateContextType {
	resume: TResumeBase | null;
	temporaryResume: TResumeBase | null;
	isLoading: boolean;
	error: Error | null;
	updateResumeField: <K extends keyof TResumeData>(field: K, value: TResumeData[K]) => void;
	updateExperience: (index: number, field: keyof TExperience, value: any) => void;
	updateEducation: (index: number, field: keyof TEducation, value: any) => void;
	addExperience: () => void;
	addEducation: () => void;
	updateSkill: (index: number, value: string) => void;
	addSkill: () => void;
	updateEntireResume: (newResumeData: TResumeData) => void;
	setTemporaryResume: (resume: TResumeBase | null) => void;
	applyTemporaryResume: () => void;
	isPending: boolean;
	updateResumePersonalInfo: (field: keyof TResumeData['personalInfo'], value: string) => void;
}

const ResumeStateContext = React.createContext<ResumeStateContextType>(
	{} as ResumeStateContextType
);

interface ResumeStateProviderProps {
	resumeId: string;
	children: React.ReactNode;
}

export const ResumeStateProvider: React.FC<ResumeStateProviderProps> = ({ resumeId, children }) => {
	const { resume: initialResume, isLoading, error } = useReadResume(resumeId);
	const [resume, setResume] = useState<TResumeBase | null>(null);
	const { mutate: updateResume, isPending } = useUpdateResume();
	const [temporaryResume, setTemporaryResume] = useState<TResumeBase | null>(null);
	useEffect(() => {
		if (initialResume) {
			setResume(initialResume);
		}
	}, [initialResume]);

	const debouncedSave = useDebouncedCallback(
		(resumeToUpdate: TResumeData) => {
			const data = resumeToUpdate;
			updateResume({ id: resumeId, resume: data });
		},
		2000,
		[resumeId]
	);

	const updateEntireResume = useCallback(
		(newResumeData: TResumeData) => {
			setResume((prev) => (prev ? { ...prev, data: newResumeData } : null));
			debouncedSave({ ...newResumeData });
		},
		[debouncedSave]
	);

	const updateResumeField = useCallback(
		<K extends keyof TResumeData>(field: K, value: TResumeData[K]) => {
			setResume((prev) => {
				if (!prev) return prev;
				const updatedData = { ...prev.data, [field]: value };
				debouncedSave({ ...updatedData });
				return { ...prev, data: updatedData };
			});
		},
		[debouncedSave]
	);

	const updateExperience = useCallback(
		(index: number, field: keyof TExperience, value: any) => {
			setResume((prev) => {
				if (!prev) return prev;
				const newExperience = [...(prev.data.experience || [])];
				newExperience[index] = { ...newExperience[index], [field]: value };
				const updatedData = { ...prev.data, experience: newExperience };
				debouncedSave({ ...updatedData });
				return { ...prev, data: updatedData };
			});
		},
		[debouncedSave]
	);

	const updateEducation = useCallback(
		(index: number, field: keyof TEducation, value: any) => {
			setResume((prev) => {
				if (!prev) return prev;
				const newEducation = [...(prev.data.education || [])];
				newEducation[index] = { ...newEducation[index], [field]: value };
				const updatedData = { ...prev.data, education: newEducation };
				debouncedSave({ ...updatedData });
				return { ...prev, data: updatedData };
			});
		},
		[debouncedSave]
	);

	const addExperience = useCallback(() => {
		setResume((prev) => {
			if (!prev) return prev;
			const newExperience = [
				...(prev.data.experience || []),
				{
					positionTitle: '',
					company: '',
					startDate: '',
					endDate: '',
					contributions: [],
				},
			];
			const updatedData = { ...prev.data, experience: newExperience };
			debouncedSave({ ...updatedData });
			return { ...prev, data: updatedData };
		});
	}, [debouncedSave]);

	const addEducation = useCallback(() => {
		setResume((prev) => {
			if (!prev) return prev;
			const newEducation = [
				...(prev.data.education || []),
				{ university: '', degree: '', startDate: '', endDate: '' },
			];
			const updatedData = { ...prev.data, education: newEducation };
			debouncedSave({ ...updatedData });
			return { ...prev, data: updatedData };
		});
	}, [debouncedSave]);

	const updateSkill = useCallback(
		(index: number, value: string) => {
			setResume((prev) => {
				if (!prev) return prev;
				const newSkills = [...(prev.data.skills || [])];
				newSkills[index] = value;
				const updatedData = { ...prev.data, skills: newSkills };
				debouncedSave({ ...updatedData });
				return { ...prev, data: updatedData };
			});
		},
		[debouncedSave]
	);

	const addSkill = useCallback(() => {
		setResume((prev) => {
			if (!prev) return prev;
			const updatedData = {
				...prev.data,
				skills: [...(prev.data.skills || []), ''],
			};
			debouncedSave({ ...updatedData });
			return { ...prev, data: updatedData };
		});
	}, [debouncedSave]);

	const applyTemporaryResume = useCallback(() => {
		if (temporaryResume) {
			updateEntireResume(temporaryResume.data);
			setTemporaryResume(null);
		}
	}, [temporaryResume, updateEntireResume]);

	useEffect(() => {
		if (temporaryResume && resume) {
			const handler = (e: MouseEvent) => {
				const target = e.target as HTMLElement;
				if (target.closest('input') || target.closest('textarea')) {
					applyTemporaryResume();
				}
			};
			document.addEventListener('mousedown', handler);
			return () => document.removeEventListener('mousedown', handler);
		}
	}, [temporaryResume, resume, applyTemporaryResume]);

	const updateResumePersonalInfo = useCallback(
		(field: keyof TResumeData['personalInfo'], value: string) => {
			setResume((prev) => {
				if (!prev) return prev;
				const updatedPersonalInfo = {
					...prev.data.personalInfo,
					[field]: value,
				};
				const updatedData = { ...prev.data, personalInfo: updatedPersonalInfo };
				debouncedSave({ ...updatedData });
				return { ...prev, data: updatedData };
			});
		},
		[debouncedSave]
	);

	const value = useMemo(
		() => ({
			resume,
			temporaryResume,
			isLoading,
			error,
			updateResumeField,
			updateExperience,
			updateEducation,
			addExperience,
			addEducation,
			updateSkill,
			addSkill,
			updateEntireResume,
			setTemporaryResume,
			applyTemporaryResume,
			isPending,
			updateResumePersonalInfo,
		}),
		[
			resume,
			temporaryResume,
			isLoading,
			error,
			updateResumeField,
			updateExperience,
			updateEducation,
			addExperience,
			addEducation,
			updateSkill,
			addSkill,
			updateEntireResume,
			setTemporaryResume,
			applyTemporaryResume,
			isPending,
			updateResumePersonalInfo,
		]
	);

	return <ResumeStateContext.Provider value={value}>{children}</ResumeStateContext.Provider>;
};

export const useResumeState = () => {
	const context = useContext(ResumeStateContext);
	if (!context) {
		throw new Error('useResumeState must be used within a ResumeStateProvider');
	}
	return context;
};
