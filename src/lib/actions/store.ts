"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"
import { and, asc, desc, eq, not, sql } from "drizzle-orm"

import { slugify } from "@/lib/utils"

import { db } from "../db"
import { products, stores, type Store } from "../db/schema"
import type { ZStoreSchema } from "../validations/store"

interface GetStoreActionInterface {
  limit?: number
  offset?: number
  sort?: `${keyof Store | "productCount"}.${"asc" | "desc"}`
  userId?: string
}

export async function getStoresAction(input: GetStoreActionInterface) {
  const limit = input.limit ?? 10
  const offset = input.offset ?? 0
  const [column, order] =
    (input.sort?.split("-") as [
      keyof Store | undefined,
      "asc" | "desc" | undefined,
    ]) ?? []

  const orderFilter =
    input.sort === "productCount.asc"
      ? asc(sql<number>`count(${products.id})`)
      : input.sort === "productCount.desc"
      ? desc(sql<number>`count(${products.id})`)
      : column && column in stores
      ? order === "asc"
        ? asc(stores[column])
        : desc(stores[column])
      : desc(stores.createdAt)

  const { items, total } = await db.transaction(async (tx) => {
    const items = await tx
      .select({
        id: stores.id,
        name: stores.name,
        productCount: sql<number>`count(${products.id})`,
      })
      .from(stores)
      .limit(limit)
      .offset(offset)
      .leftJoin(products, eq(stores.id, products.storeId))
      .where(input.userId ? eq(stores.userId, input.userId) : undefined)
      .groupBy(stores.id)
      .orderBy(orderFilter)
      .all()

    const total = await tx
      .select({
        count: sql<number>`count(${stores.id})`,
      })
      .from(stores)
      .all()

    return { items, total: total[0]?.count ?? 0 }
  })

  return { items, total }
}

export async function addStoreAction(input: ZStoreSchema) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("Unauthorized, Please sigin")
  }

  const storeWithSameName = await db.query.stores.findFirst({
    where: eq(stores.name, input.name),
  })

  if (storeWithSameName) {
    throw new Error("Store name already taken.")
  }

  await db
    .insert(stores)
    .values({
      name: input.name,
      userId: userId,
      description: input.description,
      slug: slugify(input.name),
      createdAt: new Date(),
    })
    .run()

  revalidatePath("/dashboard/stores")
}

interface UpdateStoreActionInterface extends ZStoreSchema {
  storeId: number
}

export async function updateStoreAction(input: UpdateStoreActionInterface) {
  const storeWithSameName = await db.query.stores.findFirst({
    where: and(eq(stores.name, input.name), not(eq(stores.id, input.storeId))),
    columns: {
      id: true,
    },
  })

  if (storeWithSameName) {
    throw new Error("Store name already taken.")
  }

  await db
    .update(stores)
    .set({
      name: input.name,
      description: input.description,
      slug: slugify(input.name),
    })
    .where(eq(stores.id, input.storeId))
    .run()

  revalidatePath("/dashboard/stores")
}

export async function deleteStoreAction(storeId: number) {
  const isStoreExist = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    columns: {
      id: true,
    },
  })

  if (!isStoreExist) {
    throw new Error("Store not found")
  }

  await db.delete(stores).where(eq(stores.id, storeId)).run()

  //? Delete all products of the store
  await db.delete(products).where(eq(products.storeId, storeId)).run()

  revalidatePath("/dashboard/stores")
}

// TODO: Configure husy to make precommit msg
