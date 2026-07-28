"use client";

import { Badge } from "@/components/ui/badge";
import { MembershipTypes, UserStatusTypes } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/helpers/format-date";
import { Ban, RefreshCw } from "lucide-react";

export type UsersTable = {
  id: string;
  fullName: string | null;
  email: string | null;
  createdAt: string | Date | undefined;
  membership: MembershipTypes | undefined;
  status: UserStatusTypes;
};

export const columns: ColumnDef<UsersTable>[] = [
  {
    accessorKey: "fullName",
    header: "USER",
    cell: ({ row }) => {
      const name = row.original.fullName;
      const email = row.original.email;
      return (
        <div className="flex gap-2">
          <div className="flex items-center justify-center rounded-full w-10 h-10 bg-accent text-white uppercase text-sm">
            {email?.slice(0, 2)}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-black">{name}</span>
            <span className="text-xs text-muted-foreground italic">
              {email}
            </span>
          </div>
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
    accessorKey: "createdAt",
    header: "JOINED ON",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      const safeDate = date ? new Date(date) : null;
      return (
        <p className="italic text-muted-foreground text-xs">
          {safeDate && !isNaN(safeDate.getTime())
            ? formatDate(safeDate)
            : "N/A"}
        </p>
      );
    },
  },
  {
    accessorKey: "membershipPlan",
    header: "MEMBERSHIP",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-0.5 text-sm">
          <Badge className="flex items-center gap-0.5 bg-input w-2/3">
            <span className="text-black">
              {row.original.membership?.replace("_", " ").toUpperCase()}
            </span>
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = (row.getValue("status") as UserStatusTypes) || "active";

      const variants: Record<string, string> = {
        active:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100",
        banned:
          "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 hover:bg-rose-100",
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
      const user = row.original;

      const meta = table.options.meta as {
        onBan?: (id: string) => void;
        onReactivate?: (id: string) => void;
      };

      const isBanned = user.status === "banned";

      return (
        <div className="flex items-center gap-1.5 justify-end">
          {isBanned ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
              title="Reactivate Account"
              onClick={() => meta?.onReactivate?.(user.id)}
            >
              <RefreshCw size={14} strokeWidth={2.5} />
              <span>Reactivate</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
              title="Ban Account"
              onClick={() => meta?.onBan?.(user.id)}
            >
              <Ban size={14} strokeWidth={2.5} />
              <span>Ban</span>
            </Button>
          )}
        </div>
      );
    },
  },
];
