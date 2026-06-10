import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Jeevana Matrimony",
  description:
    "Manage your profile and explore matches on Jeevana.",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <main>{children}</main>
    </div>
  );
}
