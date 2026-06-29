"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserManagementTabs = ({ currentStatus }: { currentStatus: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs
      value={currentStatus}
      onValueChange={handleTabChange}
      className="w-auto"
    >
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="flagged">Flagged</TabsTrigger>
        <TabsTrigger value="suspended">Suspended</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default UserManagementTabs;
