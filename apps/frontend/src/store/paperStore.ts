import { create } from "zustand";
import type { GeneratedPaper } from "@vedaai/shared";
import * as api from "@/lib/api";

interface PaperStore {
  paper: GeneratedPaper | null;
  loading: boolean;
  error: string | null;
  showAnswerKey: boolean;

  fetchPaper: (assignmentId: string) => Promise<void>;
  toggleAnswerKey: () => void;
  clearPaper: () => void;
}

export const usePaperStore = create<PaperStore>((set) => ({
  paper: null,
  loading: false,
  error: null,
  showAnswerKey: false,

  fetchPaper: async (assignmentId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.getPaper(assignmentId);
      set({ paper: res.data.data, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch paper",
        loading: false,
      });
    }
  },

  toggleAnswerKey: () => set((state) => ({ showAnswerKey: !state.showAnswerKey })),
  clearPaper: () => set({ paper: null, loading: false, error: null, showAnswerKey: false }),
}));
