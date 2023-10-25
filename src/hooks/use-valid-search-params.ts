import type { ReadonlyURLSearchParams } from "next/navigation"
import type { z } from "zod"

export function useValidSearchParams<T extends z.AnyZodObject>(
  schema: T,
  searchParams: ReadonlyURLSearchParams
): z.infer<T> {
  const params: Record<string, string> = {}

  searchParams.forEach((val, key) => {
    params[key] = val
  })

  return schema.parse(params)
}
