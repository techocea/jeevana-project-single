"use client";

import * as React from "react";
import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import {Label} from "../ui/label";
import {usePathname} from "next/navigation";
import {ADMIN_DASHBOARD_SIDEBAR, AppRole} from "@/lib/constants";
import {cn} from "@/lib/utils";

interface SidebarProps extends React.ComponentProps<typeof Sidebar> {
    userRole: AppRole;
}

export function AdminSidebar({userRole, ...rest}: SidebarProps) {
    const pathname = usePathname();

    return (
        <Sidebar {...rest}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/control-panel" className="flex items-center gap-2">
                                <div>
                                    <Image
                                        src="/images/logo.png"
                                        alt="matrimony, matrimonial ads, marriage bureau, find life partner, wedding ads, jeevana matrimony"
                                        width={120}
                                        height={50}
                                        style={{width: "auto", height: "auto"}}
                                    />
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {ADMIN_DASHBOARD_SIDEBAR.navMain
                            .filter((group) => !group.roles || group.roles.includes(userRole))
                            .map((item) => {
                                const visibleSubItems = item.items?.filter(
                                    (subItem) => !subItem.roles || subItem.roles.includes(userRole),
                                ) || [];

                                if (item.items && visibleSubItems.length === 0) return null;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <Label className="font-medium my-4 uppercase text-muted">
                                            {item.title}
                                        </Label>
                                        {item.items?.length ? (
                                            <SidebarMenuSub>
                                                {item.items.map((subItem) => {
                                                    const isActive =
                                                        subItem.url === "/control-panel"
                                                            ? pathname === subItem.url
                                                            : pathname.startsWith(subItem.url);
                                                    return (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={isActive}
                                                            >
                                                                <Link
                                                                    href={subItem.url}
                                                                    className={cn(
                                                                        "uppercase",
                                                                        pathname === subItem.url
                                                                            ? "font-bold"
                                                                            : "text-muted",
                                                                    )}
                                                                >
                                                                    {subItem.title}
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    );
                                                })}
                                            </SidebarMenuSub>
                                        ) : null}
                                    </SidebarMenuItem>
                                )
                            })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    );
}
