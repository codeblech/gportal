import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GradesStore {
  selectedSemester: string;
  setSelectedSemester: (semester: string) => void;
}

export const useGradesStore = create<GradesStore>()(
  persist(
    (set) => ({
      selectedSemester: "",
      setSelectedSemester: (semester: string) => set({ selectedSemester: semester }),
    }),
    {
      name: "grades-storage",
    }
  )
);
