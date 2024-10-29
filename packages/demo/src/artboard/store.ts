import { create } from "zustand";

interface ResumeData {
  basics: {
    name: string;
    email: string;
    phone: string;
  };
  sections: {
    experience: {
      items: Array<{
        id: string;
        company: string;
        position: string;
        date: string;
      }>;
    };
  };
}

interface ArtboardStore {
  resume: ResumeData | null;
  setResume: (resume: ResumeData) => void;
}

export const useArtboardStore = create<ArtboardStore>((set) => ({
  resume: null,
  setResume: (resume) => set({ resume }),
}));
