import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-4xl font-bold text-[var(--color-text)] mb-2">404</h2>
      <p className="text-[var(--color-text-muted)] mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
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
