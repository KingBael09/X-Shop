import { useCallback } from "react"

export type QueryParams = Record<string, string | number | null>

/**
 * THis make queryparam after filtering + wrap in callback, i.e only called if searchParams change
 */
export function useQueryString<T>(searchParams: T) {
  const createQueryString = useCallback(
    (params: QueryParams) => {
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
