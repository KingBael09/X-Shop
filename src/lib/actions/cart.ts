"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"
import { eq, inArray } from "drizzle-orm"

import { db } from "../db"
import { carts, products } from "../db/schema"
import type { ZCartItemSchema } from "../validations/cart"

/**
 * This is a custom cart-item type which includes data from category and store
 */
export type CustomCartItem = Awaited<ReturnType<typeof getCartAction>>[0]
// TODO: Maybe I could have extracted this logic as a helper but I don't know how to!

/**
 * This function internally check for user and if there is no user then it throws an error
 */
export async function getCartAction() {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be logged in to perform this action")
  }

  const userCart = await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
  })

  if (!userCart) {
    return [] //If there is no cart for the user then return empty array -> cart will be created when adding items
  }

  const productIds =
    userCart.items?.map((product) => Number(product.productId)) ?? []
  // FIXME: Damn if only drizzle suppported cuid's

  if (productIds.length === 0) return []

  const productsInCart = await db.query.products.findMany({
    where: inArray(products.id, productIds),
    columns: {
      id: true,
      name: true,
      images: true,
      price: true,
      description: true,
      createdAt: true,
      categoryId: true,
      subcategory: true,
      storeId: true,
    },
    with: {
      store: true,
      category: {
        columns: {
          name: true,
        },
      },
    },
  })

  // TODO: amount of data can be reduced in products in array

  const cartItems = productsInCart.map((product) => {
    const quantity = userCart.items?.find(
      (item) => item.productId === String(product.id)
    )?.quantity

    return {
      ...product,
      quantity,
    }
  })

  return cartItems
}

export async function addToCartAction(inputs: ZCartItemSchema) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be signed in to perform this action")
  }

  const cart = await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
  })

  // If there are no assigned cart assign one to user
  if (!cart) {
    //   If the cart is newly created then no need to take previous item quantity into account
    await db
      .insert(carts)
      .values({
        userId,
        createdAt: new Date(),
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
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be logged in to perform this action")
  }

  const cart = await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
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
  productId: string
}

export async function deleteCartAction(inputs: DeleteCartActionInterface) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be logged in to perform this action")
  }

  const cart = await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
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
