import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

// ── Assignment APIs ────────────────────────
export const getAssignments = (page = 1) =>
  api.get("/assignments", { params: { page, limit: 10 } });

export const getAssignment = (id: string) =>
  api.get(`/assignments/${id}`);

export const createAssignment = (formData: FormData) =>
  api.post("/assignments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getPaper = (assignmentId: string) =>
  api.get(`/assignments/${assignmentId}/paper`);

export const regenerateAssignment = (id: string) =>
  api.post(`/assignments/${id}/regenerate`);

export const deleteAssignment = (id: string) =>
  api.delete(`/assignments/${id}`);
