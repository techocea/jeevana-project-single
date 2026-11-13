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

const ReviewTabs = ({
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
            aria-label="Filter advertisements by review status"
            className="h-10 w-full"
        >
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
  );
};

export default ReviewTabs;