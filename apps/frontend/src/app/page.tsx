"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AssignmentCard } from "@/components/dashboard/AssignmentCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useAssignmentStore } from "@/store/assignmentStore";

export default function DashboardPage() {
  const { assignments, loading, error, fetchAssignments } =
    useAssignmentStore();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-danger)] mb-4">{error}</p>
        <Button onClick={() => fetchAssignments()} variant="secondary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)] tracking-tight">
            Assignments
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Manage your AI-generated assessments
          </p>
        </div>
        {assignments.length > 0 && (
          <Link href="/create">
            <Button id="btn-create-assignment">
              <PlusCircle size={16} />
              Create
            </Button>
          </Link>
        )}
      </div>

      {/* Content */}
      {loading && assignments.length === 0 ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 skeleton rounded-[var(--radius-lg)]" />
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment._id} assignment={assignment} />
          ))}
        </div>
      )}
    </div>
  );
}
