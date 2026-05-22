import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-md)] transition-all duration-200 cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm":
            variant === "primary",
          "bg-white text-[var(--color-text)] border border-[var(--color-border)] hover:bg-gray-50":
            variant === "secondary",
          "bg-transparent text-[var(--color-text-muted)] hover:bg-gray-100":
            variant === "ghost",
          "bg-[var(--color-danger)] text-white hover:bg-red-600":
            variant === "danger",
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-sm": size === "md",
          "px-6 py-2.5 text-base": size === "lg",
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
