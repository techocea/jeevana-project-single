import type {Metadata} from "next";
import {SiteHeader} from "@/components/layout/site-header";
import {Toaster} from "react-hot-toast";
import {getCurrentUser} from "@/app/actions/profile-actions";
import {redirect} from "next/navigation";
import {ADMIN_NAV_ITEMS} from "@/lib/constants";
import UserSidebar from "@/components/layout/user-sidebar";
import React from "react";
import {AppRole} from "@/types";

export const metadata: Metadata = {
    title: "Admin Dashboard | Jeevana Matrimony",
    description: "Manage your profile and explore matches on Jeevana.",
};

export default async function DashboardLayout({
                                          children,
                                      }: Readonly<{
    children: React.ReactNode;
}>) {
    const {data: currentUser} = await getCurrentUser();

    if (!currentUser) {
        redirect("/admin");
    }

    const role: AppRole = currentUser?.role;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <SiteHeader role={role} items={ADMIN_NAV_ITEMS} currentUser={currentUser}/>
            <div
                className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <UserSidebar items={ADMIN_NAV_ITEMS}/>
                <main suppressHydrationWarning className="lg:col-span-9 space-y-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
