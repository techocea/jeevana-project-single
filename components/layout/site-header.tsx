"use client";

import {LogOut, Menu, UserPlus, X} from "lucide-react";
import Image from "next/image";
import {Button} from "../ui/button";
import React, {useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {ICONS, MemberNavItem} from "@/components/layout/user-sidebar";
import {AppRole} from "@/types";
import {logout} from "@/app/actions/auth-actions";

interface HeaderUser {
    id: string;
    email: string;
    fullName: string | null;
}

interface SiteHeaderProps {
    role?:AppRole;
    items: MemberNavItem[]
    currentUser: HeaderUser | null;
}


export function SiteHeader({currentUser, items, role}: SiteHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [openMobileMenu, setOpenMobileMenu] = useState(false);


    const displayName =
        (
            typeof currentUser?.fullName === "string"
                ? currentUser.fullName.trim()
                : ""
        ) ||
        currentUser?.email?.split("@")[0] ||
        "Member";

    const initials = displayName
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();


    return (
        <header className="sticky z-40 bg-background backdrop-blur-xs border-b border-strong">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
                <div className="flex items-center gap-3">
                    <Button
                        variant={"ghost"}
                        onClick={() => setOpenMobileMenu(true)}
                        className="lg:hidden -ml-2 "
                        aria-label="Toggle navigation drawer"
                    >
                        <Menu className="w-16 h-16"/>
                    </Button>
                    <div
                        className="flex items-center gap-2.5 text-left group min-w-24 min-h-30"
                    >
                        <Image src={"/images/logo.png"} alt={"matrimonial"} width={96} height={48}
                               className={"object-cover object-center"}/>
                    </div>
                </div>
                {currentUser && (
                    <div className="flex items-center gap-2.5">
                        {role === "admin" && (
                            <Button
                                onClick={() => router.push('/control-panel/create-advertisement')}
                                className="p-2 transition-colors"
                                title="Sign out (Demo)"
                            >
                                <UserPlus className="w-4 h-4"/>
                                <span>Create on Behalf</span>
                            </Button>
                        )}
                        <div
                            className="w-8 h-8 rounded-full bg-[#E8E2D7] overflow-hidden border border-[#D6CDBC] flex items-center justify-center text-xs font-semibold text-[#554D45]">
                            <span aria-hidden="true">{initials}</span>
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-xs font-semibold text-[#1F1B18] flex items-center gap-1 leading-none">
                                <span>{displayName}</span>
                            </div>
                            <div className="text-[11px] text-[#7A7065] mt-0.5">
                                {currentUser.email}
                            </div>
                        </div>

                        <Button
                            variant={"ghost"}
                            onClick={() => logout()}
                            className="p-2 transition-colors"
                            title="Sign out (Demo)"
                        >
                            <LogOut className="w-4 h-4"/>
                        </Button>
                    </div>
                )}

                {/* MOBILE DRAWER / OFF-CANVAS MENU */}
                {openMobileMenu && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div
                            className="fixed inset-0 h-screen bg-black/40 backdrop-blur-xs"
                            onClick={() => setOpenMobileMenu(false)}
                        />
                        <div
                            className="fixed top-0 bottom-0 left-0 w-72 h-screen bg-white p-5 shadow-xl flex flex-col justify-between overflow-y-auto">
                            <div>
                                <div className="flex items-center justify-between pb-4 border-b border-strong mb-4">
                                    <div className="flex items-center gap-2">
                                        <Image src={"/images/logo.png"} alt={"matrimonial"} width={96} height={48}
                                               className={"object-cover object-center"}/>
                                    </div>
                                    <Button
                                        variant={"ghost"}
                                        onClick={() => setOpenMobileMenu(false)}
                                        className="lg:hidden -ml-2 "
                                        aria-label="Toggle navigation drawer"
                                    >
                                        <X className="w-5 h-5"/>
                                    </Button>
                                </div>

                                <div className="space-y-1">
                                    {items.map((item) => {
                                        const Icon = ICONS[item.iconName];
                                        const isActive = pathname === item.href;
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
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[#E8E2D7] text-xs text-[#8C8375]">
                                Brightly Dunsford
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
