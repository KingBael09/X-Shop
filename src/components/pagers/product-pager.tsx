import type { Route } from "next"
import { Icons } from "@/util/icons"

import type { Product } from "@/lib/db/schema"

import { ModLink } from "../mod-link"

interface ProductPagerProps {
  products: Product[]
  currentId: number
  storeId: number
}

export function ProductPager({
  products,
  currentId,
  storeId,
}: ProductPagerProps) {
  const currentIndex = products.findIndex((product) => currentId === product.id)

  const lowerFail = 0 > currentIndex - 1
  const upperFail = currentIndex + 1 >= products.length

  return (
    <div className="flex gap-2 pr-1">
      <ModLink
        replace
        variant="ghost"
        disabled={lowerFail}
        href={
          `/dashboard/stores/${storeId}/products/${products[currentIndex - 1]
            ?.id}` as Route
        }
      >
        <Icons.chevronLeft className="h-5 w-5" aria-hidden />
        <span className="sr-only">Previous product</span>
      </ModLink>
      <ModLink
        replace
        variant="ghost"
        disabled={upperFail}
        href={
          `/dashboard/stores/${storeId}/products/${products[currentIndex + 1]
            ?.id}` as Route
        }
      >
        <Icons.chevronRight className="h-5 w-5" aria-hidden />
        <span className="sr-only">Next product</span>
      </ModLink>
    </div>
  )
}
