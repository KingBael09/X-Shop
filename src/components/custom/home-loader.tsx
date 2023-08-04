import { Skeleton } from "@/ui/skeleton"
import { ProductCardLoader } from "@/components/product/product-card-loader"

export function FeaturedStoresLoading() {
  return Array.from({ length: 8 }).map((_, i) => (
    <div
      key={i}
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <div className="space-y-1.5 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-2 w-full" />
      </div>
      <div className="p-4 pt-0">
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  ))
}

export function FeaturedProductsLoading() {
  return Array.from({ length: 8 }).map((_, i) => (
    <ProductCardLoader actions key={i} />
  ))
}
