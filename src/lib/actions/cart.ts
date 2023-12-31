"use server"

import { revalidatePath } from "next/cache"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { db } from "../db"
import { carts } from "../db/schema"
import type { ZCartItemSchema } from "../validations/cart"

// TODO: This currently doesn't account for inventory
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
        items: [inputs],
      })
      .run()

    revalidatePath("/")

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

  revalidatePath("/")
}

export async function updateCartAction(inputs: ZCartItemSchema) {
  const user = await currentUser()

  if (!user) {
    throw new Error("You must be logged in to perform this action")
  }

  const cart = await db.query.carts.findFirst({
    where: eq(carts.userId, user.id),
  })

  if (!cart) {
    throw new Error("Cart not found, please create an issue at github")
  }

  const cartItem = cart.items?.find(
    (item) => item.productId === inputs.productId
  )

  if (!cartItem) {
    throw new Error("Item not found, please try again.")
  }

  if (inputs.quantity === 0) {
    cart.items =
      cart.items?.filter((item) => item.productId !== inputs.productId) ?? []
  } else {
    cartItem.quantity = inputs.quantity
  }

  await db
    .update(carts)
    .set({ items: cart.items })
    .where(eq(carts.id, cart.id))
    .run()

  revalidatePath("/")
}

interface DeleteCartActionInterface {
  productId: number
}

export async function deleteCartAction(inputs: DeleteCartActionInterface) {
  const user = await currentUser()

  if (!user) {
    throw new Error("You must be logged in to perform this action")
  }

  const cart = await db.query.carts.findFirst({
    where: eq(carts.userId, user.id),
  })

  if (!cart) {
    throw new Error("Cart not found, please create an issue at github")
  }

  cart.items =
    cart.items?.filter((item) => item.productId !== inputs.productId) ?? []

  await db
    .update(carts)
    .set({
      items: cart.items,
    })
    .where(eq(carts.id, cart.id))
    .run()

  revalidatePath("/")
}

// TODO : If i barrel this file will it reduce size
