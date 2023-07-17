"use server"

import { revalidatePath } from "next/cache"
import type { StoredFile } from "@/types"
import { and, eq } from "drizzle-orm"
import { utapi } from "uploadthing/server"

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
  const deletedProducts = await db
    .delete(products)
    .where(and(eq(products.id, id), eq(products.storeId, storeId)))
    .returning()
    .all()

  const imageList = deletedProducts[0]?.images?.map((image) => {
    return image.id
  })

  if (imageList && imageList?.length > 0) {
    await utapi.deleteFiles(imageList)
  }

  // TODO: Learn web worker to parallelize this task

  revalidatePath(`/dashboard/stores/${storeId}/products`)
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
 * @see {@link checkProductAction}
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
