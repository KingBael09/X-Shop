"use server"

import { revalidatePath } from "next/cache"
import type { OrderItem } from "@/types"
import { auth } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { db } from "../db"
import { carts, orders } from "../db/schema"
import type { ZCheckoutSchema } from "../validations/checkout"

export async function placeOrderAction(
  data: ZCheckoutSchema,
  items: OrderItem[],
  storeIds: number[]
) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be logged in to place an order")
  }

  const { name: username, mode: paymentMode, ...rest } = data

  await db
    .insert(orders)
    .values({
      items,
      storeIds,
      userId,
      paymentMode,
      username,
      ...rest,
      createdAt: new Date(),
    })
    .run()

  // delete cart items

  await db.delete(carts).where(eq(carts.userId, userId)).run()

  revalidatePath("/")
}

// TODO: Actually i haven't taken this into consideration that if any of the db.crud operation fails then what
