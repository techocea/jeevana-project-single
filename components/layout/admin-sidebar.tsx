"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {Label} from "../ui/label";
import {usePathname} from "next/navigation";
import {ADMIN_DASHBOARD_SIDEBAR, AppRole} from "@/lib/constants";

export function AdminSidebar() {
    const pathname = usePathname();

    return (
       <h1>hey</h1>
    );
}
