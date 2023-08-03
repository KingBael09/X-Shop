"use client"

import { useTransition } from "react"
import { Icons } from "@/util/icons"

import {
  deleteCartAction,
  updateCartAction,
  type CustomCartItem,
} from "@/lib/actions/cart"
import { catchError, cn } from "@/lib/utils"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"

interface UpdateCartProps extends React.HTMLAttributes<HTMLDivElement> {
  item: CustomCartItem
}

export function UpdateCart({ item, className, ...props }: UpdateCartProps) {
  const [isPending, startTransition] = useTransition()

  function deleteItem() {
    startTransition(async () => {
      try {
        await deleteCartAction({ productId: String(item.id) })
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
          productId: String(item.id),
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
          className="h-8 w-8"
          name="decrease"
          onClick={updateItem}
          disabled={isPending}
        >
          <Icons.remove className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only">Remove one item</span>
        </Button>
        <Input
          type="number"
          min="1"
          className="h-8 w-14"
          disabled={isPending}
          value={item.quantity}
          // TODO: Debounce request
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          name="increase"
          onClick={updateItem}
          disabled={isPending}
        >
          <Icons.add className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only">Add one item</span>
        </Button>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={deleteItem}
        disabled={isPending}
      >
        <Icons.trash className="h-3 w-3" aria-hidden="true" />
        <span className="sr-only">Delete item</span>
      </Button>
    </div>
  )
}
