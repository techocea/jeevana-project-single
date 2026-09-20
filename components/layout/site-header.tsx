import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import {Globe} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 -mt-1 border-0" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-6"
        />
        <h1 className="text-secondary uppercase font-sans font-bold">
          Member Dashboard
        </h1>
      </div>
      <Button variant={"outline"}>
        <Globe className="text-primary h-3 w-3"/>
        <Link href={"/"} className="text-primary">Website</Link>
      </Button>
    </header>
  );
}
