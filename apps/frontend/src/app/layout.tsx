import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "VedaAI",
    template: "%s | VedaAI",
  },
  description: "AI-powered assessment creator for educators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased bg-[#eaeaec] overflow-hidden">
        <Sidebar />
        <MobileHeader />
        <main className="lg:ml-[var(--sidebar-width)] h-screen pt-14 lg:pt-0">
          <div className="h-full p-2">
            <div className="h-full bg-[#f5f5f5] rounded-[32px] overflow-y-auto shadow-sm border border-white/50">
               {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
