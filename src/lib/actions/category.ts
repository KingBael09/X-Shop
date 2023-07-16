"use server"

import { eq } from "drizzle-orm"

import { db } from "../db"
import { categories } from "../db/schema"
import type { ZCategorySchema } from "../validations/category"

export async function AddCategoryAction(input: ZCategorySchema) {
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

export async function AddSubCategoryAction(
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
