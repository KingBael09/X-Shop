"use client"

import { useTransition } from "react"
import { Icons } from "@/util/icons"
import { toast } from "sonner"

import { deleteCartAction, updateCartAction } from "@/lib/actions/cart"
import type { CartItem } from "@/lib/helpers/cart"
import { catchError, cn } from "@/lib/utils"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"

interface UpdateCartProps extends React.HTMLAttributes<HTMLDivElement> {
  item: CartItem
}

export function UpdateCart({ item, className, ...props }: UpdateCartProps) {
  const [isPending, startTransition] = useTransition()

  function deleteItem() {
    startTransition(async () => {
      try {
        await deleteCartAction({ productId: item.id })
        toast.success("Item successfully removed from cart")
      } catch (error) {
        catchError(error)
      }
    })
  }

  function updateItem(e: React.MouseEvent<HTMLButtonElement>) {
    const step = e.currentTarget.name === "increase" ? +1 : -1

    startTransition(async () => {
      try {
        await updateCartAction({
          productId: item.id,
          quantity: Number(item.quantity) + step,
        })
      } catch (error) {
        catchError(error)
      }
    })
  }

  return (
    <div className={cn("flex items-center space-x-1", className)} {...props}>
      <div className="flex flex-1 items-center space-x-1">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          name="decrease"
          onClick={updateItem}
          disabled={isPending}
        >
          <Icons.remove className="size-3" aria-hidden="true" />
          <span className="sr-only">Remove one item</span>
        </Button>
        <Input
          readOnly
          type="number"
          min="1"
          className="h-8 w-14 cursor-default focus-visible:ring-transparent"
          disabled={isPending}
          defaultValue={item.quantity}
        />
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          name="increase"
          onClick={updateItem}
          disabled={isPending}
        >
          <Icons.add className="size-3" aria-hidden="true" />
          <span className="sr-only">Add one item</span>
        </Button>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        onClick={deleteItem}
        disabled={isPending}
      >
        <Icons.trash className="size-3" aria-hidden="true" />
        <span className="sr-only">Delete item</span>
      </Button>
    </div>
  )
}
