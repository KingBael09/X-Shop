import { cache } from "react"

import { db } from "../db"

/**
 * This is cached variant of the `getAllCategoriesAction()` uses `react.cache()`
 *
 * I pray to god that this actually works, because it somehow knows when data gets invalid
 */
export const getCachedCategoriesAction = cache(async () => {
  const categories = await db.query.categories.findMany()
  return categories
})

// TODO: Every searchParams with multiple entries should be sorted for better caching
/**
 * For example,
 *
 * category_ids=7.8 is same as category_id=8.7 but will result in refetch of page
 *
 * check in network tab for product filter
 *
 */
