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
import { Label } from "../ui/label";
import { usePathname } from "next/navigation";
import { USER_DASHBOARD_SIDEBAR } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function UserSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
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
                    style={{ width: "auto", height: "auto" }}
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
            {USER_DASHBOARD_SIDEBAR.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuSub>
                  <SidebarMenuSubItem key={item.title}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === item.url}
                    >
                      <Link
                        href={item.url}
                        className={cn(
                          "uppercase",
                          pathname === item.url
                            ? "font-semibold"
                            : "text-muted",
                        )}
                      >
                        <span>
                          <item.icon />
                        </span>
                        {item.title}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
