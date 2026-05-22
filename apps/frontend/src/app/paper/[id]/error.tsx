"use client";

import { Button } from "@/components/ui/Button";

export default function PaperError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-20">
      <h2 className="text-lg font-semibold mb-2">
        Couldn&apos;t load this paper
      </h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        {error.message}
      </p>
      <Button onClick={reset} variant="primary">
        Retry
      </Button>
    </div>
  );
}
