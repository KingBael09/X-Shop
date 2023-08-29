"use client"

import { Suspense, useTransition } from "react"
import dynamic from "next/dynamic"
import { Icons } from "@/util/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/ui/button"

import { PaginationButton } from "./pagination-button"
import { ProductLayoutWrapperContext } from "./product-layout-provider"

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

const FilterDrawer = dynamic(
  () => import("./filter-drawer").then((mod) => mod.FilterDrawer),
  {
    loading: () => (
      <Button aria-label="Sort products" size="sm">
        <Icons.altFilter className="mr-2 h-4 w-4" aria-hidden="true" />
        Filter
      </Button>
    ),
  }
)

// TODO: Due to dynamic loading a button element is created which is later filled on so during this loading there is slight layout shift due to space-x-2 -> i.e while loading there are 4 buttons

const SortDropdown = dynamic(
  () => import("./sort-dropdown").then((mod) => mod.SortDropdown),
  {
    loading: () => (
      <Button aria-label="Sort products" size="sm">
        Sort
        <Icons.chevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
      </Button>
    ),
  }
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
  const [isPending, startTransition] = useTransition()

  // TODO: Haven't seen any issues with fallback so, meh
  return (
    <Suspense fallback={<></>}>
      <ProductLayoutWrapperContext
        isPending={isPending}
        startTransition={startTransition}
      >
        <div className={cn("grid space-y-6", className)} {...props}>
          <div className="flex items-center space-x-2">
            <FilterDrawer
              stores={stores}
              categories={categories}
              storePageCount={storePageCount}
            />
            <SortDropdown />
          </div>
          {!isPending && !items ? (
            <div className="mx-auto flex max-w-xs flex-col space-y-1.5">
              <h1 className="text-center text-2xl font-bold">
                No products found
              </h1>
              <p className="text-center text-muted-foreground">
                Try changing your filters, or check back later for new products
              </p>
            </div>
          ) : null}
          {children}
          {items ? <PaginationButton pageCount={pageCount} /> : null}
        </div>
      </ProductLayoutWrapperContext>
    </Suspense>
  )
}

// TODO: Maybe it is better to use context for data-table

// TODO: Wrap components using useSearchParams with a Suspense boundary -> https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering#dynamic-functions
