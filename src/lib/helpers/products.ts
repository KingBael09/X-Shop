// export interface SearchParams {
//   [key: string]: string | string[] | undefined
// }

/**
 * This is standard search params type
 */
export type SearchParams = Record<string, string | string[] | undefined>

/**
 * This is default search params getter for product filtering
 *
 * This requires the follwing params
 * - page
 * - per_page -> limit `default:8`
 * - sort
 * - category_ids
 * - price_range
 * - store_ids
 * - store_page
 */
export function getProductSearchParams(
  searchParams: SearchParams,
  defaultLimit = 8
) {
  const limit =
    typeof searchParams.per_page === "string"
      ? parseInt(searchParams.per_page)
      : defaultLimit
  const offset =
    typeof searchParams.page === "string"
      ? (parseInt(searchParams.page) - 1) * limit
      : 0
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : null

  const category_ids =
    typeof searchParams.category_ids === "string"
      ? searchParams.category_ids
      : null
  const price_range =
    typeof searchParams.price_range === "string"
      ? searchParams.price_range
      : null
  const store_ids =
    typeof searchParams.store_ids === "string" ? searchParams.store_ids : null

  const store_page =
    typeof searchParams.store_page === "string"
      ? parseInt(searchParams.store_page) - 1
      : 0

  return {
    limit,
    offset,
    sort,
    category_ids,
    price_range,
    store_ids,
    store_page,
  }
}
