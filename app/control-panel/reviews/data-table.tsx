"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell, TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {ReactNode, useState} from "react";
import { Button } from "@/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  toolbarFilters?: ReactNode;
  meta?: {
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    onDelete?: (id: string) => void;
  };
}

export function DataTable<TData, TValue>({
  columns = [],
  data = [],
  meta,
                                           toolbarFilters,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta,
    state: {
      columnFilters,
      columnVisibility: {
        email: false,
      },
    },
    initialState:{
      pagination:{
        pageSize:5
      }
    }
  });

  const { pageIndex, pageSize } = table.getState().pagination;

  const totalRows = table.getFilteredRowModel().rows.length;
  const totalPages = Math.max(1, table.getPageCount());
  const currentPage = totalRows === 0 ? 1 : pageIndex + 1;

  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className={"space-y-4"}>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className={toolbarFilters ? "min-w-0 lg:col-span-9" : "min-w-0 lg:col-span-12"}>
          <Input
              placeholder="Search by email..."
              aria-label="Search advertisements by email"
              value={
                  (table
                      .getColumn("email")
                      ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                  table
                      .getColumn("email")
                      ?.setFilterValue(event.target.value)
              }
              className="h-10 w-full"
          />
        </div>

        {toolbarFilters && (
            <div className="min-w-0 lg:col-span-3">
              {toolbarFilters}
            </div>
        )}
      </div>
      <div className="overflow-hidden rounded-md shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
              >
                <div className="flex gap-3 text-muted-foreground items-center justify-between">
                  <p className="tabular-nums text-[12px]">
                    Showing{" "}
                    <span className="font-semibold  text-foreground">
                        {startRow}–{endRow}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-foreground">
                        {totalRows}
                    </span>{" "}
                    advertisements
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="Previous advertisement page"
                    >
                      <ChevronLeft
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                      />
                      <span>Previous</span>
                    </Button>

                    <span className="whitespace-nowrap px-2 text-[11px] font-medium tabular-nums text-foreground">
                        Page {currentPage} of {totalPages}
                    </span>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label="Next advertisement page"
                    >
                      <span>Next</span>
                      <ChevronRight
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                      />
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
