import type {Metadata} from "next";
import {SiteHeader} from "@/components/layout/site-header";
import {AdminSidebar} from "@/components/layout/admin-sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster} from "react-hot-toast";
import {getCurrentUser} from "@/app/actions/profile-actions";
import {redirect} from "next/navigation";
import {AppRole} from "@/lib/constants";

export const metadata: Metadata = {
    title: "Dashboard | Jeevana Matrimony",
    description: "Manage your profile and explore matches on Jeevana.",
};

export default async function DashboardLayout({
                                                  children,
                                              }: Readonly<{
    children: React.ReactNode;
}>) {
    const {data: currentUser} = await getCurrentUser();

    const role: "admin" | "staff" | "user" | undefined = currentUser?.role;

    return (
        <div className="min-h-screen bg-background">
            <Toaster position="top-center" reverseOrder={false}/>
            <TooltipProvider>
                <SidebarProvider
                    style={
                        {
                            "--sidebar-width": "calc(var(--spacing) * 72)",
                            "--header-height": "calc(var(--spacing) * 12)",
                        } as React.CSSProperties
                    }
                >
                    <AdminSidebar variant={"inset"} userRole={role ?? "admin"}/>
                    <SidebarInset>
                        <SiteHeader userRole={role ?? "admin"}/>
                        <main className="min-h-screen px-6 py-8 lg:px-10">{children}</main>
                    </SidebarInset>
                </SidebarProvider>
            </TooltipProvider>
        </div>
    );
}
