"use client";

import {Badge} from "@/components/ui/badge";
import {ProfileStatusTypes, VerificationStatusTypes} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Check, Dot, Eye, Trash2, ShieldCheck, Clock, AlertCircle, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {formatDate} from "@/helpers/format-date";
import Link from "next/link";

export type AdvertisementTable = {
    id: string;
    profileId: string;
    fullName: string | null;
    religion: string | null;
    caste: string | null;
    createdAt: string | Date | undefined;
    email: string | null;
    status: ProfileStatusTypes;

    // Verification fields (allow null for profiles without verification submissions)
    isVerified: boolean;
    idNumber: string | null;
    verificationStatus: VerificationStatusTypes | null;
    verificationId?: string | null;
    documentFrontUrl?: string | null;
    documentBackUrl?: string | null;
    rejectionReason?: string | null;
};

export const columns: ColumnDef<AdvertisementTable>[] = [
    {
        accessorKey: "profileId",
        header: "PROFILE ID",
        cell: ({row}) => (
            <span className="font-mono font-medium text-muted-foreground">
        #{row.getValue("profileId")}
      </span>
        ),
    },
    {
        accessorKey: "fullName",
        header: "ADVERTISER",
        cell: ({row}) => {
            const name = row.original.fullName;
            const email = row.original.email;
            return (
                <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-black">{name}</span>
                    <span className="text-xs text-muted-foreground italic">
            Created By: {email}
          </span>
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
        cell: ({row}) => {
            const religion = row.original.religion;
            const caste = row.original.caste;
            const date = row.original.createdAt;

            const safeDate = date ? new Date(date) : null;
            return (
                <div className="flex flex-col gap-0.5 text-sm">
                    <Badge className="flex items-center gap-0.5 bg-input">
                        <span className="text-black">{religion}</span>
                        <Dot size={16}/>
                        <span className="text-black">{caste}</span>
                    </Badge>
                    <p className="italic text-muted-foreground text-xs">
                        Created On:{" "}
                        {safeDate && !isNaN(safeDate.getTime())
                            ? formatDate(safeDate)
                            : "N/A"}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "verifications",
        header: "VERIFICATION(NIC)",
        cell: ({row}) => {
            const isVerified = row.original.isVerified;
            const status = row.original.verificationStatus;
            const idNumber = row.original.idNumber;

            if (isVerified) {
                return (
                    <span
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5"/> Verified
          </span>
                );
            }

            if (status === "pending") {
                return (
                    <div className="flex flex-col">
            <span
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 w-max">
              <Clock className="h-3 w-3"/> Pending Review
            </span>
                        {idNumber && <span className="text-[10px] text-slate-400 mt-0.5">{idNumber}</span>}
                    </div>
                );
            }

            if (status === "rejected") {
                return (
                    <span
                        className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            <AlertCircle className="h-3.5 w-3.5"/> Rejected
          </span>
                );
            }

            return <span className="text-xs text-slate-400">Not Submitted</span>;
        },
    },
    {
        accessorKey: "status",
        header: "STATUS",
        cell: ({row}) => {
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
        cell: ({row, table}) => {
            const profile = row.original;

            const { onApprove, onReject } = table.options.meta as {
                onApprove: (profileId: string, verificationId?: string | null) => void;
                onReject: (profileId: string, verificationId?: string | null, reason?: string) => void;
                onDelete?: (id: string) => void;
            };

            const handleConfirmReject = async (reason: string) => {
                if (onReject) {
                    await onReject(profile.id, profile.verificationId, reason);
                }
            };

            return (
                <div className="flex items-center gap-1 justify-end">
                    {row.original.status === "approved" ||
                    row.original.status === "rejected" ? (
                        <>
                            <Button variant={"view"} asChild>
                                <Link
                                    href={`/control-panel/approval-queues/${profile.id}/view`}
                                >
                                    <Eye size={16}/>
                                </Link>
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        <Trash2/>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete this profile from
                                            the database.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction variant={"destructive"}
                                                           onClick={() => onReject(row.original.id, row.original.verificationId)}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    ) : (
                        <>
                            <Button variant={"view"} asChild>
                                <Link
                                    href={`/control-panel/approval-queues/${profile.id}/view`}
                                >
                                    <Eye size={16}/>
                                </Link>
                            </Button>
                            <Button
                                variant={"approved"}
                                onClick={() => onApprove(row.original.id, row.original.verificationId)}
                            >
                                <Check/>
                            </Button>
                            <Button
                                variant={"destructive"}
                                onClick={() => {
                                    const reason = prompt("Enter reason for rejection:");
                                    if (reason) handleConfirmReject(reason);
                                }}
                            >
                                <X/>
                            </Button>
                        </>
                    )}
                </div>
            );
        },
    },
];
