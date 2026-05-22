"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { useAssignmentStore } from "@/store/assignmentStore";
import { subscribeToJob } from "@/lib/socket";

interface JobProgressProps {
  jobId: string;
  assignmentId: string;
}

const statusMessages: Record<string, string> = {
  queued: "Waiting in queue...",
  processing: "Setting up generation...",
  generating: "AI is generating questions...",
  parsing: "Validating and parsing output...",
  complete: "Paper generated successfully!",
  error: "Generation failed",
};

export function JobProgress({ jobId, assignmentId }: JobProgressProps) {
  const router = useRouter();
  const { jobProgress, setJobProgress, clearJobProgress } =
    useAssignmentStore();

  useEffect(() => {
    const unsubscribe = subscribeToJob(jobId, setJobProgress);
    return () => {
      unsubscribe();
    };
  }, [jobId, setJobProgress]);

  const status = jobProgress?.status || "queued";
  const progress = jobProgress?.progress || 10;

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
      <div className="flex items-center gap-3 mb-4">
        {status === "complete" ? (
          <CheckCircle className="text-[var(--color-success)]" size={22} />
        ) : status === "error" ? (
          <AlertCircle className="text-[var(--color-danger)]" size={22} />
        ) : (
          <Loader2
            className="text-[var(--color-primary)] animate-spin"
            size={22}
          />
        )}
        <div>
          <p className="text-sm font-medium text-[var(--color-text)]">
            {statusMessages[status] || "Processing..."}
          </p>
          {jobProgress?.message && status === "error" && (
            <p className="text-xs text-[var(--color-danger)] mt-0.5">
              {jobProgress.message}
            </p>
          )}
        </div>
      </div>

      <ProgressBar progress={progress} className="mb-4" />

      {status === "complete" && (
        <Button
          onClick={() => {
            clearJobProgress();
            router.push(`/paper/${assignmentId}`);
          }}
          className="w-full"
        >
          View Generated Paper
        </Button>
      )}
    </div>
  );
}
