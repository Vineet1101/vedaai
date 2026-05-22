import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Calendar, BookOpen, FileText } from "lucide-react";
import type { Assignment } from "@vedaai/shared";
import { AssignmentMenu } from "./AssignmentMenu";

interface AssignmentCardProps {
  assignment: Assignment;
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const statusVariant = {
    pending: "warning",
    processing: "purple",
    complete: "success",
    error: "danger",
  } as const;

  return (
    <div
      id={`card-assignment-${assignment._id}`}
      className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 hover:shadow-md transition-shadow duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link
            href={
              assignment.status === "complete"
                ? `/paper/${assignment._id}`
                : "#"
            }
            className="text-base font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors line-clamp-1"
          >
            {assignment.topic}
          </Link>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            {assignment.subject}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant[assignment.status]}>
            {assignment.status}
          </Badge>
          <AssignmentMenu assignment={assignment} />
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1">
          <BookOpen size={13} />
          {assignment.totalQuestions} Qs
        </span>
        <span className="flex items-center gap-1">
          <FileText size={13} />
          {assignment.totalMarks} marks
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={13} />
          {new Date(assignment.dueDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
