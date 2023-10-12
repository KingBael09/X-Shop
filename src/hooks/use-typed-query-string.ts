import { useCallback } from "react"
import type { ReadonlyURLSearchParams } from "next/navigation"

type TypedParams<T> = Partial<{ [P in keyof T]: T[P] }>

/**
 * Make sure to pass a generic to the hook
 * @example
 * ```ts
 * interface MyParams{
 * date:string // => makes them optional even if not mentioned
 * name:string
 * }
 * const searchParams = useSearchParams()
 * const createQueryString = useQueryString<MyParams>(searchParams)
 * ```
 * By default searchParams will be of type never. `=>` To throw error
 *
 * Makes all keys optional
 *
 */
export function useQueryString<K extends TypedParams<K> = never>(
  searchParams: ReadonlyURLSearchParams
) {
  const createQueryString = useCallback(
    (params: TypedParams<K>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString())

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

  return createQueryString
}
