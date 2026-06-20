"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { StatusTypes } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Ban, Check, Dot, Eye, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/helpers/format-date";

export type AdvertisementTable = {
  adId: string;
  fullName: string | null;
  religion: string | null;
  caste: string | null;
  createdAt: string | Date | undefined;
  email: string | null;
  status: StatusTypes;
};

export const columns: ColumnDef<AdvertisementTable>[] = [
  {
    accessorKey: "adId",
    header: "AD ID",
    cell: ({ row }) => (
      <span className="font-mono font-medium text-muted-foreground">
        #{row.getValue("adId")}
      </span>
    ),
  },
  {
    accessorKey: "fullName",
    header: "ADVERTISER",
    cell: ({ row }) => {
      const name = row.original.fullName;
      const email = row.original.email;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-black">{name}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "EMAIL",
    enableHiding: true,
  },
  {
    accessorKey: "demographics",
    header: "DEMOGRPAHICS",
    cell: ({ row }) => {
      const religion = row.original.religion;
      const caste = row.original.caste;
      const date = row.original.createdAt;

      const safeDate = date ? new Date(date) : null;
      return (
        <div className="flex flex-col gap-0.5 text-sm">
          <Badge className="flex items-center gap-0.5 bg-input">
            <span className="text-black">{religion}</span>
            <Dot size={16} />
            <span className="text-black">{caste}</span>
          </Badge>
          <p className="italic text-muted-foreground text-xs">
            Created:{" "}
            {safeDate && !isNaN(safeDate.getTime())
              ? formatDate(safeDate)
              : "N/A"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string) || "pending";

      const variants: Record<string, string> = {
        approved:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100",
        rejected:
          "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 hover:bg-rose-100",
        pending:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100",
      };

      return (
        <Badge
          className={`capitalize font-medium shadow-none ${variants[status]}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "ACTIONS",
    cell: ({ row, table }) => {
      const ad = row.original;

      const meta = table.options.meta as {
        onApprove?: (id: string) => void;
        onReject?: (id: string) => void;
      };

      return (
        <div className="flex items-center gap-1 justify-end">
          {row.original.status === "approved" ||
          row.original.status === "rejected" ? (
            <Button
              variant="outline"
              className="border-destructive hover:bg-destructive/50"
            >
              <Ban size={16} className="text-destructive" />
            </Button>
          ) : (
            <>
              <Button
                variant={"secondary"}
                onClick={() => meta?.onApprove?.(ad.adId)}
              >
                Approve
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => meta?.onReject?.(ad.adId)}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      );
    },
  },
];
