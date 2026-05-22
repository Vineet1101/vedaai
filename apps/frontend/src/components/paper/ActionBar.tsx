"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAssignmentStore } from "@/store/assignmentStore";
import { usePaperStore } from "@/store/paperStore";

interface ActionBarProps {
  assignmentId: string;
}

export function ActionBar({ assignmentId }: ActionBarProps) {
  const router = useRouter();
  const { regenerateAssignment } = useAssignmentStore();
  const { showAnswerKey, toggleAnswerKey } = usePaperStore();

  return (
    <div className="no-print sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-[var(--color-border)] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          id="btn-toggle-answers"
          variant="secondary"
          size="sm"
          onClick={toggleAnswerKey}
        >
          {showAnswerKey ? <EyeOff size={14} /> : <Eye size={14} />}
          {showAnswerKey ? "Hide Answers" : "Show Answers"}
        </Button>
        <Button
          id="btn-regenerate"
          variant="secondary"
          size="sm"
          onClick={async () => {
            await regenerateAssignment(assignmentId);
            router.push("/");
          }}
        >
          <RefreshCw size={14} />
          Regenerate
        </Button>
        <Button
          id="btn-download-pdf"
          size="sm"
          onClick={() => window.print()}
        >
          <Download size={14} />
          PDF
        </Button>
      </div>
    </div>
  );
}
