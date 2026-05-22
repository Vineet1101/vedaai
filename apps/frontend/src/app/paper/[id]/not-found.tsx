import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Home } from "lucide-react";

export default function PaperNotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-xl font-semibold mb-2">Paper not found</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        This question paper doesn&apos;t exist or hasn&apos;t been generated yet.
      </p>
      <Link href="/">
        <Button variant="secondary">
          <Home size={16} />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
