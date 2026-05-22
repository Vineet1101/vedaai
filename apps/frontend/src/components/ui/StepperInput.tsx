"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  id?: string;
  className?: string;
}

export function StepperInput({
  value,
  onChange,
  min = 0,
  max = 50,
  id,
  className,
}: StepperInputProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center border border-[var(--color-border)] rounded-[var(--radius-md)]",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="p-1.5 hover:bg-gray-50 transition-colors rounded-l-[var(--radius-md)]"
        disabled={value <= min}
      >
        <Minus size={14} className="text-[var(--color-text-muted)]" />
      </button>
      <span
        id={id}
        className="px-3 py-1 text-sm font-medium min-w-[40px] text-center border-x border-[var(--color-border)]"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="p-1.5 hover:bg-gray-50 transition-colors rounded-r-[var(--radius-md)]"
        disabled={value >= max}
      >
        <Plus size={14} className="text-[var(--color-text-muted)]" />
      </button>
    </div>
  );
}
