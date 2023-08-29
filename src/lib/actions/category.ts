"use server"

import { eq } from "drizzle-orm"

import { db } from "../db"
import { categories } from "../db/schema"
import type { ZCategorySchema } from "../validations/category"

export async function addCategoryAction(input: ZCategorySchema) {
  const sameName = await db.query.categories.findFirst({
    where: eq(categories.name, input.name),
  })
  if (sameName) {
    throw new Error("Category already exists")
  }
  await db
    .insert(categories)
    .values({
      name: input.name,
    })
    .run()
}

interface AddSubCategoryActionInterface {
  categoryId: string
  subcategories: string[]
}

/**
 * This function (`server-action`) should be used in protected routes only.
 *
 * This doesn't check for auth internally
 */
export async function addSubCategoryAction(
  input: AddSubCategoryActionInterface
) {
  await db
    .update(categories)
    .set({
      subcategories: input.subcategories,
    })
    .where(eq(categories.id, Number(input.categoryId)))
    .run()
}

// TODO: Maybe Category Delete functionality for admins?
// TODO: Cron Job to remove unused categories ?
