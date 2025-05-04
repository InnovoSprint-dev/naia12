/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useRouter } from "next/navigation";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChartConfig } from "@/components/ui/chart";

import ChartActivities from "./chart";
// import LinerChart from "./liner";
import LinerChart2 from "./liner2";

import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  PlusIcon,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

type LeadStatus = {
  id: string;
  createdAt: string | Date;
  name: string;
  createdBy: {
    id: string;
    fullName: string;
  };
  _count: {
    activity: number;
  };
};

export default function DataTableDemo() {
  const router = useRouter();

  const [chartData, setChartData] = useState<any[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    data: {
      label: "Data",
    },
  });

  const [data, setData] = useState<LeadStatus[]>([]);

  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch("/api/activities/sources", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch activities Lead Statuses");
        }
        const result = await res.json();

        const chartData = result.map((item: LeadStatus, index: number) => ({
          item: item.name,
          date: item.createdAt,
          value: item._count.activity,
          fill: `var(--chart-${index + 1})`, // Assuming you have CSS variables for colors
        }));
        setChartData(chartData);
        const chartConfig = chartData.reduce(
          (config: any, entry: any, index: any) => {
            config[entry.item] = {
              label: entry.item.charAt(0).toUpperCase() + entry.item.slice(1),
              color: `hsl(var(--chart-${index + 1}))`,
            };
            return config;
          },
          {} as Record<string, { label: string; color: string }>
        );

        setChartConfig({
          ...chartConfig,
          value: {
            label: "Activities",
          },
        } satisfies ChartConfig);

        setData(result);
      } catch (error) {
        console.error("Error fetching activities Lead statuses:", error);
      }
    };
    handler();
  }, []);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<any>({});

  const columns: ColumnDef<LeadStatus>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      id: "name",
      header: "Activity Lead Source",
      accessorFn: (row) => row.name,
      cell: ({ row }) => {
        const activitySource = row.original.name;
        return <div>{activitySource}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            createdAt
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div>
            {/* {row.getValue("createdAt")?.toString()} */}
            {date.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        );
      },
    },

    {
      id: "createdBy",
      header: "created By",
      accessorFn: (row) => row.createdBy?.fullName,
      cell: ({ row }) => {
        const salesPerson = row.original.createdBy;
        return <div>{salesPerson?.fullName}</div>;
      },
    },

    {
      id: "_count",
      header: "Activities count",
      accessorFn: (row) => row._count?.activity,
      cell: ({ row }) => {
        return <div>{row.original._count.activity}</div>;
      },
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const activity = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(activity.id)}
              >
                Copy activity ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View activity details</DropdownMenuItem>
              <DropdownMenuItem>Edit activity</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-2 justify-center items-center">
        <div className="col-span-1 md:col-span-3">
          <LinerChart2 />
        </div>

        <Card className="flex h-full w-full flex-col col-span-1 md:col-span-1 mx-auto">
          <CardHeader className="items-center pb-0">
            <CardTitle>Activities per lead status</CardTitle>
            <CardDescription>January - June 2025</CardDescription>
          </CardHeader>
          <CardContent className="flex-1  pb-0">
            <ChartActivities chartData={chartData} chartConfig={chartConfig} />
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total data for the last 6 months
            </div>
          </CardFooter>
        </Card>

        {/* <div className="col-span-1 md:col-span-2"><LinerChart chartData={chartData} chartConfig={chartConfig} /></div> */}

        {/* <pre>
      {JSON.stringify(data, null, 2)}
     </pre>  */}

        {/* <pre>
      {JSON.stringify(chartData, null, 2)}
     </pre> */}
     

      <Card className="flex flex-col col-span-1 md:col-span-2 w-full mx-auto">
        <CardHeader className="grid grid-cols-1 md:grid-cols-2 items-center gap-2 space-y-0 border-b py-5">
          <div className="grid flex-1 gap-3 text-center sm:text-left">
            <CardTitle>Activities per lead status</CardTitle>
            <CardDescription>
              {" "}
              <Input
                placeholder="Filter by client name..."
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            </CardDescription>
          </div>
          <div className="w-full items-center justify-center flex">
            <div className="flex flex-col py-4 w-full  items-end mx-auto">
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Columns <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  data-sidebar="logout"
                  data-slot="sidebar-logout"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    router.push("/activities/create");
                  }}
                >
                  {/* <PanelLeftIcon /> */}
                  <PlusIcon />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="rounded-md border w-full  max-w-[100vw] mx-auto">
            <Table className="w-full  max-w-4xl">
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
                                header.getContext()
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
                            cell.getContext()
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
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center justify-end space-x-2 py-4 w-full  mx-auto">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
    </div>
  );
}
