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

interface BuilderStore {
  frame: {
    ref: HTMLIFrameElement | null;
    setRef: (ref: HTMLIFrameElement | null) => void;
  };
  resume: ResumeData;
  updateResume: (data: Partial<ResumeData>) => void;
}

export const useBuilderStore = create<BuilderStore>((set) => ({
  frame: {
    ref: null,
    setRef: (ref) => set((state) => ({ frame: { ...state.frame, ref } })),
  },
  resume: {
    basics: {
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
    },
    sections: {
      experience: {
        items: [
          {
            id: "1",
            company: "Example Corp",
            position: "Software Engineer",
            date: "2020 - Present",
          },
        ],
      },
    },
  },
  updateResume: (data) =>
    set((state) => ({
      resume: { ...state.resume, ...data },
    })),
}));
