"use server"

import { revalidatePath } from "next/cache"
import type { PromiseReturnType, StoredFile } from "@/types"
import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  like,
  lte,
  not,
  sql,
} from "drizzle-orm"
import { utapi } from "uploadthing/server"

import { db } from "../db"
import { products, type Product } from "../db/schema"
import type { ZGetProductSchema, ZProductSchema } from "../validations/product"

export async function getProductAction(input: ZGetProductSchema) {
  const [column, order] =
    (input.sort?.split(".") as [
      keyof Product | undefined,
      "asc" | "desc" | undefined,
    ]) ?? []

  const [minPrice, maxPrice] = input.price_range?.split("-") ?? []
  const category_ids = input.category_ids?.split(".").map(Number) ?? []
  const storeIds = input.store_ids?.split(".").map(Number) ?? []

  const filter = and(
    category_ids.length
      ? inArray(products.categoryId, category_ids)
      : undefined,
    minPrice ? gte(products.price, Number(minPrice)) : undefined,
    maxPrice ? lte(products.price, Number(maxPrice)) : undefined,
    storeIds.length ? inArray(products.storeId, storeIds) : undefined
  )

  const { items, total } = await db.transaction(async (tx) => {
    const items = await tx.query.products.findMany({
      limit: input.limit,
      offset: input.offset,
      where: filter,
      orderBy:
        column && column in products
          ? order === "asc"
            ? asc(products[column])
            : desc(products[column])
          : desc(products.createdAt),
    })

    const total = await tx
      .select({
        count: sql<number>`count(${products.id})`,
      })
      .from(products)
      .where(filter)
      .all()

    return { items, total: total[0]?.count ?? 0 }
  })

  return { items, total }
}

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

export async function checkProductAction(input: { name: string; id?: number }) {
  const isProductExist = await db.query.products.findFirst({
    where: input.id
      ? and(not(eq(products.id, input.id)), eq(products.name, input.name))
      : eq(products.name, input.name),
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
      inventory: Number(inventory),
      price: Number(price),
      ...rest,
    })
    .run()

  revalidatePath(`/dashboard/stores/${rest.storeId}/products.`)
}

interface UpdateProductActionInterface extends ZProductSchema {
  id: number
  storeId: number
  images?: StoredFile[] | null
  isImageUpdated: boolean
}

export async function updateProductAction({
  id,
  price,
  categoryId,
  inventory,
  isImageUpdated,
  ...rest
}: UpdateProductActionInterface) {
  const orignalProductData = await db.query.products.findFirst({
    where: and(eq(products.id, id), eq(products.storeId, rest.storeId)),
  })

  if (!orignalProductData) {
    throw new Error("Product not found")
  }

  await db
    .update(products)
    .set({
      id,
      price: Number(price),
      categoryId: Number(categoryId),
      inventory: Number(inventory),
      ...rest,
    })
    .where(eq(products.id, id))
    .run()

  if (isImageUpdated) {
    const imageList = orignalProductData.images?.map((image) => image.id)
    if (imageList && imageList.length > 0) {
      await utapi.deleteFiles(imageList)
    }
  }

  revalidatePath(`/dashboard/stores/${rest.storeId}/products`)
}

export type FilteredProductType = PromiseReturnType<typeof filterProductAction>

export async function filterProductAction(query: string) {
  if (query.length === 0) return null

  const filteredProducts = await db.query.products.findMany({
    columns: {
      id: true,
      name: true,
      subcategory: true,
      images: true,
    },
    where: like(products.name, `%${query}%`), // Dammit it took me too long to realize that %_% matches all positions
    limit: 10,
    with: {
      category: {
        columns: { name: true },
      },
    },
  })

  // Make set here to remove duplicate values
  const categoryList = [
    ...new Set(filteredProducts.map((p) => p.category.name)),
  ]

  const productByCategory = categoryList.map((c) => ({
    name: c,
    product: filteredProducts.filter((p) => p.category.name === c),
  }))

  return productByCategory
}
