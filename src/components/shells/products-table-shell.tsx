"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { Badge } from "@/ui/badge"
import { Button } from "@/ui/button"
import { Checkbox } from "@/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu"
import type { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

import { deleteProductAction } from "@/lib/actions/product"
import type { Category, Product } from "@/lib/db/schema"
import { catchError, formatDate, formatPrice } from "@/lib/utils"
import { Icons } from "@/components/util/icons"

import { DataTable } from "../data-table/data-table"
import { DataTableColumnHeader } from "../data-table/data-table-column-head"

type Data = Product & { category: { name: string } }

interface ProductTableShellProps {
  data: Data[]
  count: number
  storeId: number
  categories: Omit<Category, "subcategories">[]
}

export function ProductsTableShell({
  data,
  count,
  storeId,
  categories,
}: ProductTableShellProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([])

  const columns = useMemo<ColumnDef<Data, unknown>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value)
              setSelectedRowIds((prev) =>
                prev.length === data.length ? [] : data.map((row) => row.id)
              )
            }}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value)
              setSelectedRowIds((prev) =>
                value
                  ? [...prev, row.original.id]
                  : prev.filter((id) => id !== row.original.id)
              )
            }}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        // Disable column sorting for this column
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Category" />
        ),
        cell: ({ row }) => {
          const category = row.original.category.name
          return (
            <Badge variant="outline" className="capitalize">
              {category}
            </Badge>
          )
        },
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
      },
      {
        accessorKey: "inventory",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Inventory" />
        ),
      },
      {
        accessorKey: "rating",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Rating" />
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ cell }) => formatDate(cell.getValue() as Date),
        enableColumnFilter: false,
      },
      {
        // Column for row actions
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                  <Icons.horizontalThreeDots className="h-4 w-4" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/stores/${storeId}/products/${row.original.id}`}
                  >
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/products/${row.original.id}`}>View</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    startTransition(() => {
                      row.toggleSelected(false)

                      toast.promise(
                        deleteProductAction({
                          id: row.original.id,
                          storeId,
                        }),
                        {
                          loading: "Deleting...",
                          success: () => "Product deleted successfully.",
                          error: (err: unknown) => {
                            catchError(err)
                            return null
                          },
                        }
                      )
                    })
                  }}
                  disabled={isPending}
                >
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [data, isPending, storeId]
  )

  function deleteSelectedRows() {
    toast.promise(
      Promise.all(
        selectedRowIds.map((id) =>
          deleteProductAction({
            id,
            storeId,
          })
        )
      ),
      {
        loading: "Deleting...",
        success: () => {
          setSelectedRowIds([])
          return "Products deleted successfully."
        },
        error: (err: unknown) => {
          setSelectedRowIds([])
          catchError(err)
          return null
        },
      }
    )
  }

  const categoryList = categories?.map((category) => {
    const name = category.name
    return {
      label: `${name.charAt(0).toUpperCase()}${name.slice(1)}`,
      value: name,
    }
  })

  return (
    <DataTable
      columns={columns}
      data={data}
      count={count}
      filterableColumns={[
        {
          id: "category",
          title: "Category",
          options: categoryList,
        },
      ]}
      searchableColumns={[
        {
          id: "name",
          title: "Name",
        },
      ]}
      newRowLink={`/dashboard/stores/${storeId}/products/create`}
      deleteRowsAction={deleteSelectedRows}
    />
  )
}
