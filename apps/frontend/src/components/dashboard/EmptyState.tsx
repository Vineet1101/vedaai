import Link from "next/link";
import { FileText, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-[var(--color-primary-light)] rounded-2xl flex items-center justify-center mb-4">
        <FileText size={28} className="text-[var(--color-primary)]" />
      </div>
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">
        No assignments yet
      </h2>
      <p className="text-sm text-[var(--color-text-muted)] max-w-sm mb-6">
        Create your first AI-powered assessment to get started. It only takes a
        minute.
      </p>
      <Link href="/create">
        <Button id="btn-create-assignment" size="lg">
          <PlusCircle size={18} />
          Create Assignment
        </Button>
      </Link>
    </div>
  );
}
