import type { PromiseReturnType } from "@/types"
import { auth } from "@clerk/nextjs"
import { eq, inArray } from "drizzle-orm"

import { db } from "../db"
import { carts, products } from "../db/schema"

/**
 * This is a custom cart-item type which includes data from category and store
 */
export type CustomCartItem = PromiseReturnType<typeof getCartAction>[number]

/**
 * This function internally check for user and if there is no user then it throws an error
 *
 * @description Note that this is not a `server-action`
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
  // FIXME: Damn if only drizzle suppported cuid's -> Update: it supports now via `$defaultFn`

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
      category: {
        columns: {
          name: true,
        },
      },
    },
  })

  const cartItems = productsInCart.map((product) => {
    const quantity = userCart.items?.find(
      (item) => item.productId === product.id
    )?.quantity

    return {
      ...product,
      quantity,
    }
  })

  return cartItems
}
