/* eslint-disable react-hooks/exhaustive-deps */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
  type TransitionStartFunction,
} from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { LayoutProps } from "@/types"

import { filterPriceRange } from "@/config/site"
import {
  productPageSearchParams,
  type ProductPageSearchParams,
} from "@/lib/validations/search-params"
import { useDebounce } from "@/hooks/use-debounce"
import { useQueryString } from "@/hooks/use-query-string"
import { useValidSearchParams } from "@/hooks/use-valid-search-params"

interface WrapperContextInterface {
  params: ProductPageSearchParams
  isPending: boolean
  startTransition: TransitionStartFunction

  values: {
    priceRange: [number, number]
    categoryIds: number[] | null
    storeIds: number[] | null
  }

  pathname: string
  createQueryString: ReturnType<typeof useQueryString<ProductPageSearchParams>>

  setters: {
    setPriceRange: Dispatch<SetStateAction<[number, number]>>
    setCategoryIds: Dispatch<SetStateAction<number[] | null>>
    setStoreIds: Dispatch<SetStateAction<number[] | null>>
  }
}

const WrapperContext = createContext({} as WrapperContextInterface)

interface ProductLayoutWrapperContextProps extends LayoutProps {
  startTransition: TransitionStartFunction
  isPending: boolean
}

export function ProductLayoutWrapperContext({
  children,
  isPending,
  startTransition,
}: ProductLayoutWrapperContextProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { page, per_page, sort, store_ids, store_page, category_ids } =
    useValidSearchParams(productPageSearchParams, searchParams)

  const createQueryString =
    useQueryString<ProductPageSearchParams>(searchParams)

  const [priceRange, setPriceRange] = useState<[number, number]>([
    filterPriceRange.lower,
    filterPriceRange.upper,
  ])
  const debouncedPrice = useDebounce(priceRange, 600)

  useEffect(() => {
    const [min, max] = debouncedPrice

    startTransition(() => {
      router.replace(
        `${pathname}?${createQueryString({
          price_range: `${min}-${max}`,
        })}`
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

  const params = {
    page,
    per_page,
    sort,
    store_ids,
    store_page,
    category_ids,
  }

  const setters = {
    setPriceRange,
    setCategoryIds,
    setStoreIds,
  }

  const values = {
    priceRange,
    categoryIds,
    storeIds,
  }

  const wrapperValues: WrapperContextInterface = {
    params,
    isPending,
    startTransition,
    setters,
    values,
    pathname,
    createQueryString,
  }

  return (
    <WrapperContext.Provider value={wrapperValues}>
      {children}
    </WrapperContext.Provider>
  )
}

export const useProductLayoutContext = () => useContext(WrapperContext)
