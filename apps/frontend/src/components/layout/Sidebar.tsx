"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Smartphone, 
  Clock, 
  Settings,
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { href: "/home", label: "Home", icon: LayoutDashboard },
  { href: "/groups", label: "My Groups", icon: Users },
  { href: "/", label: "Assignments", icon: FileText },
  { href: "/toolkit", label: "AI Teacher's Toolkit", icon: Smartphone },
  { href: "/library", label: "My Library", icon: Clock },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[var(--sidebar-width)] bg-[#fafafa] border-r border-[#eaebec] flex flex-col z-40 max-lg:hidden border-r-2">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center overflow-hidden">
            <div className="bg-gradient-to-br from-orange-600 to-amber-800 w-full h-full flex items-center justify-center rounded-md font-bold text-white shadow-inner">
               V
            </div>
          </div>
          <span className="text-xl font-bold text-[#333333] tracking-tight">
            VedaAI
          </span>
        </Link>
      </div>

      {/* Create Button */}
      <div className="px-5 mb-6">
        <Link href="/create" className="block w-full">
          <div className="bg-[#2c2c2c] hover:bg-[#1f1f1f] transition-colors relative rounded-full p-[2px] shadow-sm">
            <div className="absolute inset-0 rounded-full border border-orange-500 opacity-50 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
            <div className="relative flex items-center justify-center gap-2 py-3 px-4 bg-[#2c2c2c] rounded-full">
               <Sparkles size={16} className="text-white" />
               <span className="text-sm font-semibold text-white">Create Assignment</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/" || pathname.startsWith("/create")
              : pathname.startsWith(item.href);
              
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-150",
                isActive
                  ? "bg-[#eaeaec] text-[#2c2c2c] shadow-sm"
                  : "text-[#8c8e92] hover:bg-[#f0f0f0] hover:text-[#2c2c2c]"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-4 pb-2">
         <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-[#8c8e92] hover:bg-[#f0f0f0] hover:text-[#2c2c2c] transition-all duration-150"
          >
            <Settings size={20} />
            Settings
          </Link>
      </div>

      {/* Footer Profile */}
      <div className="p-4">
        <div className="flex items-center gap-3 p-3 bg-[#eaeaec] rounded-2xl cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
            {/* Using a placeholder avatar image */}
            <div className="text-2xl">🐵</div>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#2c2c2c] truncate leading-tight">
              Delhi Public School
            </p>
            <p className="text-[11px] text-[#8c8e92] truncate mt-0.5">
              Bokaro Steel City
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
