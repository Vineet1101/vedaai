import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create Assignment" };

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
