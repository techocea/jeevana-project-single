import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteHeader } from "@/components/layout/site-header";
import { UserSidebar } from "@/components/layout/user-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {getCurrentUser} from "@/app/actions/profile-actions";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
  title: "My Dashboard | Jeevana Matrimony",
  description: "Manage your profile and explore matches on Jeevana.",
};

export default async function MyDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const {data: currentUser} = await getCurrentUser();

    if (!currentUser) {
        redirect("/auth?mode=login");
    }

    if (currentUser.onboardingStatus === "INCOMPLETED") {
        redirect("/onboarding");
    }

    const role: "admin" | "staff" | "user" | undefined = currentUser?.role;

  return (
    <div className="min-h-screen bg-background">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <TooltipProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <UserSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader userRole={role}/>
            <main suppressHydrationWarning className="min-h-screen bg-linear-to-br from-transparent to-primary/5 px-6 py-8 lg:px-10">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
