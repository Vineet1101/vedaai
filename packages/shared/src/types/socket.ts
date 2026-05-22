// ========================
// WebSocket Event Types
// ========================

export type JobStatus =
  | "queued"
  | "processing"
  | "generating"
  | "parsing"
  | "complete"
  | "error";

export interface JobUpdateEvent {
  jobId: string;
  status: JobStatus;
  progress: number; // 0-100
  assignmentId?: string;
  message?: string;
}
