"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Icons } from "@/util/icons"

import { sortOptions } from "@/config/products"
import { cn } from "@/lib/utils"
import { Button } from "@/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu"

import { useProductLayoutContext } from "./product-layout-provider"

export function SortDropdown() {
  const router = useRouter()

  const { params, pathname, isPending, startTransition, createQueryString } =
    useProductLayoutContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Sort products" size="sm" disabled={isPending}>
          Sort
          <Icons.chevronDown className="ml-2 size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.label}
            className={cn(
              option.value === params.sort && "bg-accent font-bold",
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
        {params.sort !== "createdAt.desc" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={pathname}>
                <Icons.close className="mr-2 size-4" aria-hidden />
                Clear Filter
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
