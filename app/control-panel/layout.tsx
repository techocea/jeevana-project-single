import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Dashboard | Jeevana Matrimony",
  description: "Manage your profile and explore matches on Jeevana.",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <TooltipProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AdminSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <main className="min-h-screen px-6 py-8 lg:px-10">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
