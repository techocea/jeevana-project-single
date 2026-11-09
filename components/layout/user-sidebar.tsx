"use client";

import * as React from "react";
import {usePathname, useRouter} from "next/navigation";
import {
    Home,
    User,
    Search,
    Mail,
    Lock,
    ShieldCheck,
    CreditCard,
    Settings
} from "lucide-react";
import { Button } from "../ui/button";


// TODOO: ADD INVITATIONS AND CURRENT USER CODE HERE

// const pendingReceivedInvitations = invitations.filter(
//     (i) => i.direction === 'received' && i.status === 'pending'
// ).length;

export const NAV_ITEMS = [
    {href: '/my-dashboard', label: 'Overview', icon: Home},
    {href: '/my-profile', label: 'My Profile', icon: User},
    {href: '/best-proposals', label: 'Best Proposals', icon: Search},
    {
        href: '/invitations',
        label: 'Invitations',
        icon: Mail,
        // badge: pendingReceivedInvitations > 0 ? pendingReceivedInvitations : undefined
    },
    {
        href: '/verify',
        label: 'Verify Account',
        icon: ShieldCheck,
        // badge: userProfile.hrefentityVerificationStatus === 'verified' ? '✓' : undefined
    },
    {href: '/membership', label: 'Membership & Billing', icon: CreditCard},
    {href: '/settings', label: 'Settings', icon: Settings},
];

function UserSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex lg:flex-col lg:justify-between lg:col-span-3 bg-white rounded-lg border border-strong p-4 shadow-2xs space-y-6 sticky h-full top-[110px]">
            {/* Navigation Links */}
            <nav className="space-y-2 w-full flex flex-col">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Button
                            key={item.href}
                            variant={isActive ? "secondary" : "ghost"}
                            onClick={() => router.push(item.href)}
                            className={"w-full justify-start"}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </div>

                    {/*        {item.badge !== undefined && (*/}
                    {/*            <span*/}
                    {/*                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${*/}
                    {/*                    typeof item.badge === 'number'*/}
                    {/*                        ? 'bg-[#8E6516] text-white'*/}
                    {/*                        : 'bg-[#DCFCE7] text-[#15803D]'*/}
                    {/*                }`}*/}
                    {/*            >*/}
                    {/*  {item.badge}*/}
                    {/*</span>*/}
                    {/*        )}*/}
                        </Button>
                    );
                })}
            </nav>

            {/* Upgrade to Premium version */}
            <div className="p-3.5 bg-[#FAF8F5] rounded-md border border-[#E8E2D7] text-xs text-[#554D45] space-y-1.5">
                <div className="font-semibold text-[#1F1B18] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#8E6516]" />
                    <span>Family Privacy Shield</span>
                </div>
                <p className="text-[11px] text-[#665D52] leading-tight">
                    All telephone and identity documents are encrypted. Only verified candidates can initiate contact.
                </p>
            </div>
        </aside>
    );
}

export default UserSidebar
