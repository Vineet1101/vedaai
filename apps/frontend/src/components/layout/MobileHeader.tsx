"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, LayoutDashboard, PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/create", label: "Create Assignment", icon: PlusCircle },
];

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-4 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[var(--color-primary)] rounded-md flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-base font-semibold">VedaAI</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="p-1">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Drawer overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        >
          <nav
            className="absolute left-0 top-14 bottom-0 w-64 bg-white p-4 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium",
                    isActive
                      ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                      : "text-[var(--color-text-muted)]"
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
