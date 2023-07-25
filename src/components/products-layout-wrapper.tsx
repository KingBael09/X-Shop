/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Icons } from "@/util/icons"

import { sortOptions } from "@/config/products"
import { filterPriceRange } from "@/config/site"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { useQueryString } from "@/hooks/use-query-string"
import { Button } from "@/ui/button"
import { Checkbox } from "@/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { ScrollArea } from "@/ui/scroll-area"
import { Separator } from "@/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/sheet"
import { Slider } from "@/ui/slider"

import { MultiSelect } from "./multi-select"
import { PaginationButton } from "./pagination-button"

interface StoreWithCount {
  id: number
  name: string
  productCount: number
}
interface ProductsLayoutWrapperProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  items: number
  pageCount: number
  categories?: {
    label: string
    value: number
  }[]
  stores: StoreWithCount[]
  storePageCount?: number
}

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
  const store_ids = searchParams?.get("store_ids")
  const store_page = searchParams?.get("store_page") ?? "1"
  const category_ids = searchParams?.get("category_ids")

  const createQueryString = useQueryString(searchParams)

  const [priceRange, setPriceRange] = useState<[number, number]>([
    filterPriceRange.lower,
    filterPriceRange.upper,
  ])
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
    <div className={cn("grid space-y-6", className)} {...props}>
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
              <div className="space-y-4">
                <h3 className="text-sm font-medium tracking-wide text-foreground">
                  Price range (₹)
                </h3>
                <Slider
                  variant="range"
                  thickness="thin"
                  defaultValue={[
                    filterPriceRange.lower,
                    filterPriceRange.upper,
                  ]}
                  max={filterPriceRange.upper}
                  step={filterPriceRange.step}
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
              {categories && categories.length ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium tracking-wide text-foreground">
                    Categories
                  </h3>
                  <MultiSelect
                    value={categoryIds}
                    onValueChange={setCategoryIds}
                    options={categories}
                    placeholder="Select categories"
                  />
                </div>
              ) : null}
              {stores.length ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="flex-1 text-sm font-medium tracking-wide text-foreground">
                      Stores
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          startTransition(() => {
                            router.push(
                              `${pathname}?${createQueryString({
                                store_page: Number(store_page) - 1,
                              })}`
                            )
                          })
                        }}
                        disabled={Number(store_page) === 1 || isPending}
                      >
                        <Icons.chevronLeft
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Previous store page</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          startTransition(() => {
                            router.push(
                              `${pathname}?${createQueryString({
                                store_page: Number(store_page) + 1,
                              })}`
                            )
                          })
                        }}
                        disabled={
                          Number(store_page) === storePageCount || isPending
                        }
                      >
                        <Icons.chevronRight
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Next store page</span>
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {stores.map((store) => (
                        <div
                          key={store.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`store-${store.id}`}
                            checked={storeIds?.includes(store.id) ?? false}
                            onCheckedChange={(value) => {
                              if (value) {
                                setStoreIds([...(storeIds ?? []), store.id])
                              } else {
                                setStoreIds(
                                  storeIds?.filter((id) => id !== store.id) ??
                                    null
                                )
                              }
                            }}
                          />
                          <Label
                            htmlFor={`store-${store.id}`}
                            className="line-clamp-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {store.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : null}
            </div>
            <div>
              <Separator className="my-4" />
              <SheetFooter>
                <Button
                  aria-label="Clear filters"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    startTransition(() => {
                      router.push(
                        `${pathname}?${createQueryString({
                          price_range: `${filterPriceRange.lower}-${filterPriceRange.upper}`,
                          store_ids: null,
                          categories: null,
                          subcategories: null,
                        })}`
                      )
                      setPriceRange([
                        filterPriceRange.lower,
                        filterPriceRange.upper,
                      ])
                      setCategoryIds(null)
                      setStoreIds(null)
                    })
                  }}
                  disabled={isPending}
                >
                  Clear Filters
                </Button>
              </SheetFooter>
            </div>
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
        />
      ) : null}
    </div>
  )
}
