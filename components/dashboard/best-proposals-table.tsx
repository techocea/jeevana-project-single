"use client";

import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { ProfileCard } from "@/components/landing/profile-card";
import { Button } from "@/components/ui/button";

const BestProposalsTable = ({
    profiles,
    columns = [],
}: {
    profiles: any[];
    columns?: any[];
}) => {
    const table = useReactTable({
        data: profiles,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 4,
            },
        },
    });

    const pageRows = table.getRowModel().rows;

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full flex flex-col items-center gap-6">
                {pageRows.length > 0 ? (
                    pageRows.map((row) => (
                        <ProfileCard
                            key={row.id}
                            currentProfileId={row?.original?.id || ""}
                            profileCardData={row.original}
                        />
                    ))
                ) : (
                    <div className="text-center text-muted-foreground">
                        No profiles found.
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {profiles.length > 0 && (
                <div className="flex items-center gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <span className="text-sm font-medium text-black">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default BestProposalsTable;
