"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserManagementTabs = ({
                              currentStatus,
                            }: {
  currentStatus: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    params.delete("page");

    const query = params.toString();

    router.push(
        query ? `${pathname}?${query}` : pathname,
        { scroll: false },
    );
  };

  return (
      <Select
          value={currentStatus || "all"}
          onValueChange={handleStatusChange}
      >
        <SelectTrigger
            aria-label="Filter users by status"
            className="h-10 w-full"
        >
          <SelectValue placeholder="All users" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All users</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="banned">Banned</SelectItem>
        </SelectContent>
      </Select>
  );
};

export default UserManagementTabs;