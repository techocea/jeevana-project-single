"use client";

import { Badge } from "@/components/ui/badge";
import { MembershipTypes, UserStatusTypes } from "@/types";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/helpers/format-date";
import { STATUS_ACTIONS } from "@/lib/constants";

export type UsersTable = {
  userId: string;
  fullName: string | null;
  email: string | null;
  createdAt: string | Date | undefined;
  membership: MembershipTypes;
  status: UserStatusTypes;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    onUserFlag?: (userId: string) => void;
    onUserSuspend?: (userId: string) => void;
    onUserReactivate?: (userId: string) => void;
  }
}

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
          <Badge className="flex items-center gap-0.5 bg-input">
            <span className="text-black">{row.original.membership}</span>
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
        suspended:
          "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 hover:bg-rose-100",
        flagged:
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
      const user = row.original;

      const meta = table.options.meta;

      const currentStatus = (row.original.status ||
        "active") as keyof typeof STATUS_ACTIONS;
      const availableButtons = STATUS_ACTIONS[currentStatus] || [];

      return (
        <div className="flex items-center gap-1.5 justify-end">
          {availableButtons.map(({ icon: Icon, color, action, label }) => (
            <Button
              key={action}
              variant="outline"
              size="icon"
              className={`h-8 w-8 shrink-0 transition-colors ${color}`}
              title={label}
              onClick={() => meta?.[action]?.(user.userId)}
            >
              <Icon size={14} strokeWidth={2.5} />
            </Button>
          ))}
        </div>
      );
    },
  },
];
