"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Eye, RefreshCw, Trash2 } from "lucide-react";
import { useAssignmentStore } from "@/store/assignmentStore";
import type { Assignment } from "@vedaai/shared";

interface AssignmentMenuProps {
  assignment: Assignment;
}

export function AssignmentMenu({ assignment }: AssignmentMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { deleteAssignment, regenerateAssignment } = useAssignmentStore();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
      >
        <MoreVertical size={16} className="text-[var(--color-text-muted)]" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-lg z-50 py-1">
          {assignment.status === "complete" && (
            <button
              onClick={() => {
                router.push(`/paper/${assignment._id}`);
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--color-text)] hover:bg-gray-50"
            >
              <Eye size={14} />
              View Paper
            </button>
          )}
          <button
            onClick={async () => {
              await regenerateAssignment(assignment._id);
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--color-text)] hover:bg-gray-50"
          >
            <RefreshCw size={14} />
            Regenerate
          </button>
          <button
            onClick={async () => {
              await deleteAssignment(assignment._id);
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--color-danger)] hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
