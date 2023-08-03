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
