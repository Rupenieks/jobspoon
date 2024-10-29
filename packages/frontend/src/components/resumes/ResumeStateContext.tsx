import useDebouncedCallback from "@/hooks/useDebouncedCallback";
import { useReadResume } from "@/hooks/useReadResume";
import { useUpdateResume } from "@/hooks/useUpdateResume";
import { TResume } from "@redundant/common/src";
import React, { useCallback, useContext, useEffect, useState } from "react";

interface ResumeStateContextType {
  resume: TResume | null;
  isLoading: boolean;
  error: Error | null;
  updateResumeField: <K extends keyof TResume>(
    field: K,
    value: TResume[K]
  ) => void;
  updateExperience: (
    index: number,
    field: keyof TResume["experience"][0],
    value: any
  ) => void;
  updateEducation: (
    index: number,
    field: keyof TResume["education"][0],
    value: any
  ) => void;
  addExperience: () => void;
  addEducation: () => void;
  updateSkill: (index: number, value: string) => void;
  addSkill: () => void;
  updateEntireResume: (newResume: TResume) => void;
}

const ResumeStateContext = React.createContext<ResumeStateContextType>(
  {} as ResumeStateContextType
);

interface ResumeStateProviderProps {
  resumeId: string;
  children: React.ReactNode;
}

export const ResumeStateProvider: React.FC<ResumeStateProviderProps> = ({
  resumeId,
  children,
}) => {
  const { data: initialResume, isLoading, error } = useReadResume(resumeId);
  const [resume, setResume] = useState<TResume | null>(null);
  const { mutate: updateResume } = useUpdateResume();

  useEffect(() => {
    if (initialResume) {
      setResume(initialResume);
    }
  }, [initialResume]);

  const debouncedSave = useDebouncedCallback(
    (resumeToUpdate: TResume) => {
      const { matches, application, ...resumeData } = resumeToUpdate;
      updateResume({ id: resumeId, resume: resumeData });
    },
    2000,
    [resumeId]
  );

  const updateEntireResume = useCallback(
    (newResume: TResume) => {
      setResume(newResume);
      const { matches, application, ...resumeData } = newResume;
      debouncedSave(newResume);
    },
    [debouncedSave]
  );

  const updateResumeField = useCallback(
    <K extends keyof TResume>(field: K, value: TResume[K]) => {
      setResume((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, [field]: value };
        debouncedSave(updated);
        return updated;
      });
    },
    [debouncedSave]
  );

  const updateExperience = useCallback(
    (index: number, field: keyof TResume["experience"][0], value: any) => {
      setResume((prev) => {
        if (!prev) return prev;
        const newExperience = [...(prev.experience || [])];
        newExperience[index] = { ...newExperience[index], [field]: value };
        const updated = { ...prev, experience: newExperience };
        debouncedSave(updated);
        return updated;
      });
    },
    [debouncedSave]
  );

  const updateEducation = useCallback(
    (index: number, field: keyof TResume["education"][0], value: any) => {
      setResume((prev) => {
        if (!prev) return prev;
        const newEducation = [...(prev.education || [])];
        newEducation[index] = { ...newEducation[index], [field]: value };
        const updated = { ...prev, education: newEducation };
        debouncedSave(updated);
        return updated;
      });
    },
    [debouncedSave]
  );

  const addExperience = useCallback(() => {
    setResume((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        experience: [
          ...(prev.experience || []),
          {
            positionTitle: "",
            company: "",
            startDate: "",
            endDate: "",
            contributions: [],
          },
        ],
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const addEducation = useCallback(() => {
    setResume((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        education: [
          ...(prev.education || []),
          { university: "", degree: "", startDate: "", endDate: "" },
        ],
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const updateSkill = useCallback(
    (index: number, value: string) => {
      setResume((prev) => {
        if (!prev) return prev;
        const newSkills = [...(prev.skills || [])];
        newSkills[index] = value;
        const updated = { ...prev, skills: newSkills };
        debouncedSave(updated);
        return updated;
      });
    },
    [debouncedSave]
  );

  const addSkill = useCallback(() => {
    setResume((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, skills: [...(prev.skills || []), ""] };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const value = {
    resume,
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
  };

  return (
    <ResumeStateContext.Provider value={value}>
      {children}
    </ResumeStateContext.Provider>
  );
};

export const useResumeState = () => {
  const context = useContext(ResumeStateContext);
  if (!context) {
    throw new Error("useResumeState must be used within a ResumeStateProvider");
  }
  return context;
};
