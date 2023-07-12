"use server"

import { auth } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

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

  await db.insert(stores).values({
    name: input.name,
    userId: userId,
    description: input.description,
    slug: slugify(input.name),
  })
}
