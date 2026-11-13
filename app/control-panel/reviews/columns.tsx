"use client";

import {Badge} from "@/components/ui/badge";
import {GenderTypes, ProfileStatusTypes} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Dot, Eye} from "lucide-react";
import {Button} from "@/components/ui/button";
import {getAccurateAge} from "@/helpers/format-date";
import Link from "next/link";

export type AdvertisementTable = {
    id: string;
    profileId: string;
    dob: Date | null;
    city: string | null;
    gender: GenderTypes
    email:string | null;
    country: string | null;
    fullName: string | null;
    createdAt: Date | null;
    status: ProfileStatusTypes;
};

export const columns: ColumnDef<AdvertisementTable>[] = [
    {
        accessorKey: "profileId",
        header: "AD REF",
        cell: ({row}) => {
            const profileId = row.original.profileId;

            return (
                <span className="font-mono font-semibold text-primary">{profileId}</span>
            )
        },
    },
    {
        accessorKey: "fullName",
        header: "MEMBER",
        cell: ({row}) => {
            const name = row.original.fullName;
            const dob = row.original.dob;
            const gender = row.original.gender;

            const parsedDOB = dob
                ? dob instanceof Date
                    ? dob.toISOString().split("T")[0]
                    : String(dob).split("T")[0]
                : null;

            const age = parsedDOB
                ? getAccurateAge(parsedDOB)
                : null;

    console.log("Age:", age);
            return (
                <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-black">{name}</span>
                    <div className="flex gap-2 text-xs text-muted-foreground italic">
                        <span>{age} yrs</span>
                        <Dot className={"w-4 h-4"}/>
                        <span>{gender}</span></div>
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
        accessorKey: "location",
        header: "LOCATION",
        cell: ({row}) => {

            const city = row.original.city;
            const country = row.original.country;

            console.log("city:", city);
            console.log("country:", country);
            return (
                <div className="flex gap-2 text-sm">
                    <p className="text-muted-foreground text-xs">
                        {city}, {country}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "SUBMITTED/LISTED",
        cell: ({row}) => {
            const rowSubmittedAt = row.original.createdAt;

            const parsedSubmittedAt = rowSubmittedAt?.toISOString().split("T")[0]

            return <span className="text-xs text-muted-foreground">{parsedSubmittedAt}</span>;
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
                    className={`capitalize rounded-md font-medium shadow-none ${variants[status]}`}
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "actions",
        header: "ACTIONS",
        cell: ({row}) => {
            const profile = row.original;

            return (
                <div className="flex items-center gap-1 justify-end">
                    <Button variant={"outline"} asChild>
                        <Link
                            href={`/control-panel/reviews/${profile.id}/view`}
                        >
                            <Eye size={16}/> <span>Review</span>
                        </Link>
                    </Button>
                </div>
            );
        },
    },
];
