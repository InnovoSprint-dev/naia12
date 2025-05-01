
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// export type Payment = {
//   id: string
//   amount: number
//   status: "pending" | "processing" | "success" | "failed"
//   email: string
// }

type Activity = {
  id: string;
  createdBy: { id: string; fullName: string };
  createdAt: string | Date;
  activityTitle: string;
  activityDate: string | Date;
  salesPerson: {
    id: string;
    fullName: string;
    managedBy?: {
      id: string;
      fullName: string;
      managedBy?: {
        id: string;
        fullName: string;
      };
    };
  };
  activitySource: { id: string; name: string };
  activityCategory: { id: string; name: string };
  activityType: { id: string; name: string };
  project: { id: string; name: string };
  activityUnitType: { id: string; name: string };
  activityLeadStatus: { id: string; name: string };
  activityNotInterestedReason: { id: string; name: string };
  clientName: string;
  salesBroker: { id: string; fullName: string };
  budget: number;
  contact: string;
  compatetior: string;
  leadBrokerage: boolean;
  agentBrokerage: boolean;
  Remarks: string;
};

export default function DataTableDemo({ data }: { data: Activity[] }) {
    const router = useRouter()
    const columns: ColumnDef<Activity>[] = [
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
            accessorKey: "activityDate",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              )
            },
            cell: ({ row }) => {
              const date = new Date(row.getValue("activityDate"))
              return <div>{date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</div>
            },
          },


          {
            id: "salesPerson",
            header: "Sales Person",
            accessorFn: (row) => row.salesPerson?.fullName,
            cell: ({ row }) => {
              const salesPerson = row.original.salesPerson
              return <div>{salesPerson?.fullName}</div>
            },
          },
          {
            id: "activitySource",
            header: "Source",
            accessorFn: (row) => row.activitySource?.name,
            cell: ({ row }) => {
              const activitySource = row.original.activitySource
              return <div>{activitySource?.name}</div>
            },
          },

          {
            id: "activityCategory",
            header: "Category",
            accessorFn: (row) => row.activityCategory?.name,
            cell: ({ row }) => {
              const activityCategory = row.original.activityCategory
              return <div>{activityCategory?.name}</div>
            },
          },


          {
            id: "activityType",
            header: "Activity Type",
            accessorFn: (row) => row.activityType?.name,
            cell: ({ row }) => {
              const activityType = row.original.activityType
              return <div>{activityType?.name}</div>
            },
          },

        {
          accessorKey: "clientName",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Client Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => <div>{row.getValue("clientName")}</div>,
        },













       
      
        {
          id: "project",
          header: "Project",
          accessorFn: (row) => row.project?.name,
          cell: ({ row }) => {
            const project = row.original.project
            return <div>{project?.name}</div>
          },
        },



        {
            id: "activityUnitType",
            header: "Unit Type",
            accessorFn: (row) => row.activityUnitType?.name,
            cell: ({ row }) => {
              const activityUnitType = row.original.activityUnitType
              return <div>{activityUnitType?.name}</div>
            },
          },
     
        {
          accessorKey: "budget",
          header: () => <div className="text-right">Budget</div>,
          cell: ({ row }) => {
            const budget = parseFloat(row.getValue("budget"))
      
            // Format the amount as a currency
            const formatted = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "EGP",
            }).format(budget)
      
            return <div className="text-right font-medium">{formatted}</div>
          },
        },







        {
            id: "contact",
            header: "Contact",
            accessorFn: (row) => row.contact,
            cell: ({ row }) => {
              const contact = row.original.contact
              return <div>{contact}</div>
            },
          },

















        {
          id: "leadStatus",
          header: "Lead Status",
          accessorFn: (row) => row.activityLeadStatus?.name,
          cell: ({ row }) => {
            const leadStatus = row.original.activityLeadStatus
            return <div>{leadStatus?.name}</div>
          },
        },


        


        {
            id: "activityNotInterestedReason",
            header: "ActivityNotInterestedReason",
            accessorFn: (row) => row.activityNotInterestedReason?.name,
            cell: ({ row }) => {
              const activityNotInterestedReason = row.original.activityNotInterestedReason
              return <div>{activityNotInterestedReason?.name}</div>
            },
          },



          {
            id: "compatetior",
            header: "Competitor",
            accessorFn: (row) => row.compatetior,
            cell: ({ row }) => {
              const compatetior = row.original.compatetior
              return <div>{compatetior}</div>
            },
          },


          {
            id: "leadBrokerage",
            header: "Lead Brokerage",
            accessorFn: (row) => row.leadBrokerage,
            cell: ({ row }) => {
              const leadBrokerage = row.original.leadBrokerage
              return <div>{leadBrokerage ? "TRUE"  : "False"}</div>
            },
          },


          {
            id: "agentBrokerage",
            header: "Agent Brokerage",
            accessorFn: (row) => row.agentBrokerage,
            cell: ({ row }) => {
              const agentBrokerage = row.original.agentBrokerage
              return <div>{agentBrokerage ? "TRUE"  : "False"}</div>
            },
          },

          {
            id: "Remarks",
            header: "Agent Brokerage",
            accessorFn: (row) => row.Remarks,
            cell: ({ row }) => {
              const Remarks = row.original.Remarks
              return <div>{Remarks}</div>
            },
          },


  
  
        

        {
            accessorKey: "activityTitle",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Activity Title
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              )
            },
            cell: ({ row }) => <div>{row.getValue("activityTitle")}</div>,
          },
        {
          id: "actions",
          enableHiding: false,
          cell: ({ row }) => {
            const activity = row.original
      
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
            )
          },
        },
      ]
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

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
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 w-full min-w-[800px] max-w-[60vw] mx-auto">
        <Input
          placeholder="Filter by client name..."
          value={(table.getColumn("clientName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("clientName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
                  data-sidebar="logout"
                  data-slot="sidebar-logout"
                  variant="ghost"
                  size="icon"
                  onClick={() => {router.push("/activities/create") }}
                >
                  {/* <PanelLeftIcon /> */}
                  <PlusIcon />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
      </div>
      <div className="rounded-md border w-full min-w-[800px] max-w-[60vw] mx-auto">
        <Table  className="w-full min-w-[800px] max-w-4xl">
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
                  )
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
      <div className="flex items-center justify-end space-x-2 py-4 w-full min-w-[800px] max-w-[60vw] mx-auto">
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
    </div>
  )
}
