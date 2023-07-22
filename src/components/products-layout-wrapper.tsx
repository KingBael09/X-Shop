/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { LayoutProps } from "@/types"

import { sortOptions } from "@/config/products"
import { type Category } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

import { PaginationButton } from "./pagination-button"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { Slider } from "./ui/slider"
import { Icons } from "./util/icons"

interface ProductsLayoutWrapperProps extends LayoutProps {
  items: number
  pageCount: number
  categories: Category[]
  stores: {
    id: number
    name: string
    productCount: number
  }[]
}

export type Params = Record<string, string | number | null>

export function ProductsLayoutWrapper({
  children,
  items,
  pageCount,
  categories,
  stores,
}: ProductsLayoutWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const page = searchParams?.get("page") ?? "1"
  const per_page = searchParams?.get("per_page") ?? "8"
  const sort = searchParams?.get("sort") ?? "createdAt.desc"
  const store_ids = searchParams?.get("store_ids")
  const store_page = searchParams?.get("store_page") ?? "1"
  const category_ids = searchParams?.get("category_ids")

  const createQueryString = useCallback(
    (params: Params) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [searchParams]
  )

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const debouncedPrice = useDebounce(priceRange, 600)

  useEffect(() => {
    const [min, max] = debouncedPrice

    startTransition(() => {
      router.replace(
        `${pathname}?${createQueryString({ price_range: `${min}-${max}` })}`
      )
    })
  }, [debouncedPrice])

  // TODO: Category selection remaining
  const [categoryIds, setCategoryIds] = useState<number[] | null>(
    category_ids?.split(".").map(Number) ?? null
  )

  useEffect(() => {
    startTransition(() => {
      router.replace(
        `${pathname}?${createQueryString({
          category_ids: categoryIds?.length ? categoryIds.join(".") : null,
        })}`
      )
    })
  }, [categoryIds])

  const [storeIds, setStoreIds] = useState<number[] | null>(
    store_ids?.split(".").map(Number) ?? null
  )

  useEffect(() => {
    startTransition(() => {
      router.replace(
        `${pathname}?${createQueryString({
          store_ids: storeIds?.length ? storeIds.join(".") : null,
        })}`
      )
    })
  }, [storeIds])

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
          <SheetContent className="flex flex-col">
            <SheetHeader className="px-1">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <Separator />
            <div className="flex flex-1 flex-col gap-5 overflow-hidden px-1">
              <h3 className="text-sm font-medium tracking-wide text-foreground">
                Price range (₹)
              </h3>
              <Slider
                variant="range"
                thickness="thin"
                defaultValue={[0, 10000]}
                max={10000}
                step={500}
                value={priceRange}
                onValueChange={(value: typeof priceRange) => {
                  setPriceRange(value)
                }}
              />
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={priceRange[1]}
                  className="h-9"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    setPriceRange([value, priceRange[1]])
                  }}
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={priceRange[0]}
                  max={500}
                  className="h-9"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    setPriceRange([priceRange[0], value])
                  }}
                />
              </div>
            </div>
            {categories.length ? (
              // <MultiSelector
              //   value={categoryIds}
              //   onSelect={setCategoryIds}
              //   options={categories.map((c) => ({
              //     label: toTitleCase(c.name),
              //     value: String(c.id),
              //   }))}
              // />
              <></>
            ) : null}
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
          createQueryString={createQueryString}
        />
      ) : null}
    </div>
  )
}

// TODO : Globalize createQuery hook
