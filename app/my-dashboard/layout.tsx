import type {Metadata} from "next";
import {Toaster} from 'react-hot-toast';
import {SiteHeader} from "@/components/layout/site-header";
import {getCurrentUser} from "@/app/actions/profile-actions";
import {redirect} from "next/navigation";
import React from "react";
import UserSidebar from "@/components/layout/user-sidebar";
import {NAV_ITEMS} from "@/lib/constants";
import {AppRole} from "@/types";

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

    // if (currentUser.onboardingStatus === "INCOMPLETED") {
    //     redirect("/onboarding");
    // }

    const role: AppRole = currentUser?.role;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <SiteHeader role={role} items={NAV_ITEMS} currentUser={currentUser}/>
            <div
                className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <UserSidebar items={NAV_ITEMS}/>
                <main suppressHydrationWarning className="lg:col-span-9 space-y-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
