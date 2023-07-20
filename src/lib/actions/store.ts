"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"
import { and, eq, not } from "drizzle-orm"

import { slugify } from "@/lib/utils"

import { db } from "../db"
import { products, stores } from "../db/schema"
import type { ZStoreSchema } from "../validations/store"

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
