"use server"

import { revalidatePath } from "next/cache"
import type { StoredFile } from "@/types"
import { eq } from "drizzle-orm"

import { db } from "../db"
import { products } from "../db/schema"
import type { ZProductSchema } from "../validations/product"

interface DeleteProductionActionInterface {
  id: number
  storeId: number
}

export async function deleteProductAction({
  id,
  storeId,
}: DeleteProductionActionInterface) {
  console.log(id)
}

export async function checkProductAction(input: { name: string }) {
  const isProductExist = await db.query.products.findFirst({
    where: eq(products.name, input.name),
  })

  if (isProductExist) {
    throw new Error("Product already exists")
  }
}

interface AddProductActionInterface extends ZProductSchema {
  storeId: number
  images?: StoredFile[] | null
}

/**
 * This Function doesn't ensure if the db has product with same name already exists
 */
export async function addProductAction({
  categoryId,
  inventory,
  price,
  ...rest
}: AddProductActionInterface) {
  await db
    .insert(products)
    .values({
      categoryId: Number(categoryId),
      createdAt: new Date(),
      inventory: Number(inventory),
      price: Number(price),
      ...rest,
    })
    .run()

  revalidatePath(`/dashboard/stores/${rest.storeId}/products.`)
}
