import { create } from "zustand";
import type { Assignment, JobUpdateEvent } from "@vedaai/shared";
import * as api from "@/lib/api";

interface AssignmentStore {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  currentJobId: string | null;
  jobProgress: JobUpdateEvent | null;

  fetchAssignments: (page?: number) => Promise<void>;
  createAssignment: (
    data: FormData
  ) => Promise<{ assignmentId: string; jobId: string }>;
  deleteAssignment: (id: string) => Promise<void>;
  regenerateAssignment: (
    id: string
  ) => Promise<{ jobId: string }>;
  setJobProgress: (event: JobUpdateEvent) => void;
  clearJobProgress: () => void;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignments: [],
  loading: false,
  error: null,
  currentJobId: null,
  jobProgress: null,

  fetchAssignments: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const res = await api.getAssignments(page);
      set({ assignments: res.data.data, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch",
        loading: false,
      });
    }
  },

  createAssignment: async (data: FormData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.createAssignment(data);
      const { assignmentId, jobId } = res.data.data;
      set({ currentJobId: jobId, loading: false });
      return { assignmentId, jobId };
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create",
        loading: false,
      });
      throw err;
    }
  },

  deleteAssignment: async (id: string) => {
    try {
      await api.deleteAssignment(id);
      set((state) => ({
        assignments: state.assignments.filter((a) => a._id !== id),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete",
      });
    }
  },

  regenerateAssignment: async (id: string) => {
    try {
      const res = await api.regenerateAssignment(id);
      const { jobId } = res.data.data;
      set({ currentJobId: jobId });
      return { jobId };
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to regenerate",
      });
      throw err;
    }
  },

  setJobProgress: (event: JobUpdateEvent) => set({ jobProgress: event }),
  clearJobProgress: () =>
    set({ jobProgress: null, currentJobId: null }),
}));
