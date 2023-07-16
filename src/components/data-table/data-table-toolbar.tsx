import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Table } from "@tanstack/react-table"

import { cn } from "@/lib/utils"

import { buttonVariants } from "../ui/button"
import { Input } from "../ui/input"
import { Icons } from "../util/icons"
import { DataTabelViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  // const router = useRouter()
  const pathname = usePathname()
  return (
    <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Link
          aria-label="Add new item"
          href={`${pathname}/create`}
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "sm",
            }),
            "h-8"
          )}
        >
          <Icons.addCircle className="mr-2 h-4 w-4" />
          New
        </Link>
        <DataTabelViewOptions table={table} />
      </div>
    </div>
  )
}
