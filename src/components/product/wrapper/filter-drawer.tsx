/* eslint-disable react-hooks/exhaustive-deps */

import { usePathname, useRouter } from "next/navigation"
import { Icons } from "@/util/icons"

import { filterPriceRange } from "@/config/site"
import { Button } from "@/ui/button"
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

import { MultiSelect } from "../../multi-select"
import { useProductLayoutContext } from "./product-layout-provider"
import type {
  FilteredCategory,
  StoreWithCount,
} from "./products-layout-wrapper"

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

  const {
    params,
    values,
    setters,
    isPending,
    startTransition,
    createQueryString,
  } = useProductLayoutContext()

  const { store_page } = params
  const { setCategoryIds, setPriceRange, setStoreIds } = setters
  const { categoryIds, priceRange, storeIds } = values

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
          {categories?.length ? (
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
                  setOpen(false)
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
