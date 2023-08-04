/* eslint-disable react-hooks/exhaustive-deps */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { filterPriceRange } from "@/config/site"
import { useDebounce } from "@/hooks/use-debounce"
import { useQueryString } from "@/hooks/use-query-string"

const WrapperContext = createContext({})

export function ProductLayoutWrapperContext() {
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

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return null
}
