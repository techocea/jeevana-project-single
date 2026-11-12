"use client";

import * as React from "react";
import {usePathname, useRouter} from "next/navigation";
import {
    BadgeCheck,
    BarChart3,
    CreditCard,
    FilePen,
    FileSearch,
    Home,
    Mail,
    Lock,
    Search,
    Settings,
    ShieldCheck,
    User,
    Users,
    type LucideIcon,
} from "lucide-react";
import {Button} from "../ui/button";


// TODOO: ADD INVITATIONS AND CURRENT USER CODE HERE

// const pendingReceivedInvitations = invitations.filter(
//     (i) => i.direction === 'received' && i.status === 'pending'
// ).length;

export type MemberNavItem = {
    id: number;
    label: string;
    href: string;
    iconName: IconName;
}

export type IconName =
    | "bar-chart"
    | "file-search"
    | "file-pen"
    | "badge-check"
    | "users"
    | "mail"
    | "credit-card"
    | "home"
    | "user"
    | "search"
    | "shield-check"
    | "settings";

export type SidebarProps = {
    items: MemberNavItem[]
};

export const ICONS: Record<IconName, LucideIcon> = {
    "bar-chart": BarChart3,
    "file-search": FileSearch,
    "file-pen": FilePen,
    "badge-check": BadgeCheck,
    users: Users,
    mail: Mail,
    "credit-card": CreditCard,
    home: Home,
    user: User,
    search: Search,
    "shield-check": ShieldCheck,
    settings: Settings,
};

function UserSidebar({items}: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <aside aria-label="Admin navigation"
            className="hidden lg:flex lg:flex-col lg:justify-between lg:col-span-3 bg-white rounded-lg border border-strong p-4 shadow-2xs space-y-6 sticky h-full top-[110px]">
            <nav className="space-y-2 w-full flex flex-col">
                {items.map((item) => {
                    const Icon = ICONS[item.iconName];
                    const isActive =
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                    return (
                        <Button
                            key={item.id}
                            variant={isActive ? "secondary" : "ghost"}
                            onClick={() => router.push(item.href)}
                            className={"w-full justify-start"}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4"/>
                                <span>{item.label}</span>
                            </div>
                        </Button>
                    );
                })}
            </nav>

            {/* Upgrade to Premium version */}
            <div className="p-3.5 bg-[#FAF8F5] rounded-md border border-[#E8E2D7] text-xs text-[#554D45] space-y-1.5">
                <div className="font-semibold text-[#1F1B18] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#8E6516]"/>
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
