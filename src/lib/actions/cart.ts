"use server"

import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { db } from "../db"
import { carts } from "../db/schema"
import type { ZCartItemSchema } from "../validations/cart"

export async function addToCartAction(inputs: ZCartItemSchema) {
  const user = await currentUser()

  if (!user) {
    throw new Error("You must be signed in to perform this action")
  }

  const cart = await db.query.carts.findFirst({
    where: eq(carts.userId, user.id),
  })

  // If there are no assigned cart assign one to user
  if (!cart) {
    //   If the cart is newly created then no need to take previous item quantity into account
    await db
      .insert(carts)
      .values({
        userId: user.id,
        createdAt: new Date(),
        items: [inputs],
      })
      .run()

    return
  }

  const alreadyCartItem = cart.items?.find(
    (item) => item.productId === inputs.productId
  )

  if (alreadyCartItem) {
    alreadyCartItem.quantity += inputs.quantity // This refrences cart.items
  } else {
    cart.items?.push(inputs)
  }

  await db
    .update(carts)
    .set({ items: cart.items })
    .where(eq(carts.id, cart.id))
    .run()
}
