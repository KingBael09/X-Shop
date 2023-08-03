"use client"

import { useState, useTransition } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Icons } from "@/util/icons"

import { sortOptions } from "@/config/products"
import { cn } from "@/lib/utils"
import { useQueryString } from "@/hooks/use-query-string"
import { Button } from "@/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu"

import { PaginationButton } from "./pagination-button"

export interface StoreWithCount {
  id: number
  name: string
  productCount: number
}

export interface FilteredCategory {
  label: string
  value: number
}
interface ProductsLayoutWrapperProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  items: number
  pageCount: number
  categories?: FilteredCategory[]
  stores: StoreWithCount[]
  storePageCount?: number
}

const FilterDrawer = dynamic(() =>
  import("./filter-drawer").then((mod) => mod.FilterDrawer)
)

export function ProductsLayoutWrapper({
  children,
  items,
  pageCount,
  categories,
  stores,
  storePageCount,
  className,
  ...props
}: ProductsLayoutWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const page = searchParams?.get("page") ?? "1"
  const per_page = searchParams?.get("per_page") ?? "8"
  const sort = searchParams?.get("sort") ?? "createdAt.desc"

  const createQueryString = useQueryString(searchParams)

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn("grid space-y-6", className)} {...props}>
      <div className="flex items-center space-x-2">
        <Button
          ria-label="Filter products"
          size="sm"
          onClick={() => setIsOpen((prev) => !prev)}
          disabled={isPending}
        >
          <Icons.altFilter className="mr-2 h-4 w-4" aria-hidden="true" />
          Filter
        </Button>
        <FilterDrawer
          open={isOpen}
          stores={stores}
          setOpen={setIsOpen}
          categories={categories}
          storePageCount={storePageCount}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Sort products" size="sm" disabled={isPending}>
              Sort
              <Icons.chevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.label}
                className={cn(
                  option.value === sort && "bg-accent font-bold",
                  "cursor-pointer"
                )}
                onClick={() => {
                  startTransition(() => {
                    router.push(
                      `${pathname}?${createQueryString({
                        sort: option.value,
                      })}`
                    )
                  })
                }}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
            {sort !== "createdAt.desc" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={pathname}>
                    <Icons.close className="mr-2 h-4 w-4" aria-hidden />
                    Clear Filter
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {!isPending && !items ? (
        <div className="mx-auto flex max-w-xs flex-col space-y-1.5">
          <h1 className="text-center text-2xl font-bold">No products found</h1>
          <p className="text-center text-muted-foreground">
            Try changing your filters, or check back later for new products
          </p>
        </div>
      ) : null}
      {children}
      {items ? (
        <PaginationButton
          page={page}
          sort={sort}
          per_page={per_page}
          pageCount={pageCount}
          isPending={isPending}
        />
      ) : null}
    </div>
  )
}

// TODO: Maybe it is better to use context for tis and data-table
