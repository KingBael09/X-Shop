/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { filterPriceRange } from "@/config/site"
import { useDebounce } from "@/hooks/use-debounce"
import { useQueryString } from "@/hooks/use-query-string"
import { Checkbox } from "@/ui/checkbox"
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
} from "@/ui/sheet"
import { Slider } from "@/ui/slider"

import { MultiSelect } from "./multi-select"
import type {
  FilteredCategory,
  StoreWithCount,
} from "./products-layout-wrapper"
import { Button } from "./ui/button"
import { Icons } from "./util/icons"

interface FilterDrawerProps {
  open: boolean
  setOpen: (open: boolean) => void
  categories?: FilteredCategory[]
  stores: StoreWithCount[]
  storePageCount?: number
}

export function FilterDrawer({
  open,
  setOpen,
  stores,
  categories,
  storePageCount,
}: FilterDrawerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const createQueryString = useQueryString(searchParams)

  const store_ids = searchParams?.get("store_ids")
  const store_page = searchParams?.get("store_page") ?? "1"
  const category_ids = searchParams?.get("category_ids")

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

  const [categoryIds, setCategoryIds] = useState<number[] | null>(
    category_ids?.split(".").map(Number) ?? null
  )

  useEffect(() => {
    startTransition(() => {
      router.replace(
        `${pathname}?${createQueryString({
          category_ids: categoryIds?.length
            ? categoryIds.sort((a, b) => a - b).join(".") // sorting ids so that reverse of same category doesn't refetch page
            : null,
        })}`
      )
    })
  }, [categoryIds])

  const [storeIds, setStoreIds] = useState<number[] | null>(
    store_ids
      ?.split(".")
      .map(Number)
      .sort((a, b) => a - b) ?? null
    // sorting ids so that reverse of same category doesn't refetch page
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
    <Sheet open={open} onOpenChange={setOpen}>
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
              defaultValue={[filterPriceRange.lower, filterPriceRange.upper]}
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
                    <Icons.chevronLeft className="h-4 w-4" aria-hidden="true" />
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
                    <div key={store.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`store-${store.id}`}
                        checked={storeIds?.includes(store.id) ?? false}
                        onCheckedChange={(value) => {
                          if (value) {
                            setStoreIds([...(storeIds ?? []), store.id])
                          } else {
                            setStoreIds(
                              storeIds?.filter((id) => id !== store.id) ?? null
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
  )
}

// TODO: It is better to use a context for useTranstion hook specially
