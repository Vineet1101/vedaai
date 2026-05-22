import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div
      className={cn(
        "w-full h-2 bg-gray-100 rounded-full overflow-hidden",
        className
      )}
      id="progress-bar"
    >
      <div
        className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
