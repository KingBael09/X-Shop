"use client"

import { useTransition } from "react"
import type { LayoutProps } from "@/types"

import { Product } from "@/lib/db/schema"

import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Separator } from "./ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { Icons } from "./util/icons"

interface ProductsLayoutWrapperProps extends LayoutProps {
  items: number
}

export function ProductsLayoutWrapper({
  children,
  items,
}: ProductsLayoutWrapperProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="grid space-y-6">
      <div className="flex items-center space-x-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button ria-label="Filter products" size="sm" disabled={isPending}>
              <Icons.altFilter className="mr-2 h-4 w-4" aria-hidden="true" />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="px-1">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <Separator />
            <div>{/* Sheet Content here */}</div>
          </SheetContent>
        </Sheet>
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
            {/* Sorting Options here */}
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
      {items ? <></> : null}
    </div>
  )
}
