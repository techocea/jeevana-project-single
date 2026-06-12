import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip"

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
       <TooltipProvider>{children}</TooltipProvider>
    </div>
  );
}
