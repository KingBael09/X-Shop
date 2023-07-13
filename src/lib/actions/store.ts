"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"
import { and, eq, not } from "drizzle-orm"

import { db } from "../db"
import { stores } from "../db/schema"
import { slugify } from "../utils"
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
    })
    .run()

  revalidatePath(`/dashboard/stores/${input.storeId}`)
}
