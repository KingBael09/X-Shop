"use server"

import { eq } from "drizzle-orm"

import { db } from "../db"
import { categories } from "../db/schema"
import type { ZCategorySchema } from "../validations/category"

/**
 * This call doesn't cache any data
 * @deprecated use `getCachedCategoriesAction()`
 */
export async function getAllCategoriesAction() {
  return await db.query.categories.findMany()
  // TODO: use a prepared statement from drizzle
}

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
// TODO: Maybe this could fail on some condition but idk where it will fail

// TODO: Maybe Delete functionality for admins?
