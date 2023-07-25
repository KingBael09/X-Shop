"use client"

import { useTransition } from "react"
import { Icons } from "@/util/icons"

import { addToCartAction } from "@/lib/actions/cart"
import { Button, type ButtonProps } from "@/ui/button"

interface AddToCartButtonProps extends ButtonProps {
  productId: string
}

/**
 * This is a custom client site component for adding Item to cart
 */
export function AddToCartButton({
  productId,
  children,
  ...props
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition()

  function addToCart() {
    startTransition(async () => {
      await addToCartAction({ productId, quantity: 1 })
    })
  }
  return (
    <Button {...props} onClick={addToCart} disabled={isPending}>
      {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
