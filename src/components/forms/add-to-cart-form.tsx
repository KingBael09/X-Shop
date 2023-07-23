"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { addToCartAction } from "@/lib/actions/cart"
import { catchError } from "@/lib/utils"
import { cartSchema, type ZCartSchema } from "@/lib/validations/cart"
import { Button } from "@/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form"
import { Input } from "@/ui/input"
import { Icons } from "@/components/util/icons"

interface AddToCartFormProps {
  productId: number
}

export function AddToCartForm({ productId }: AddToCartFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<ZCartSchema>({
    resolver: zodResolver(cartSchema),
    defaultValues: {
      quantity: 1,
    },
  })

  function onSubmit({ quantity }: ZCartSchema) {
    startTransition(async () => {
      try {
        await addToCartAction({
          productId: String(productId),
          quantity,
        })
        toast.success("Item added to cart")
      } catch (error) {
        catchError(error)
      }
    })
  }

  const isMinValid = form.watch("quantity") > 0

  return (
    <Form {...form}>
      <form
        className="grid gap-4 sm:max-w-[240px]"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  {...field}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending || !isMinValid}>
          {isPending && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden />
          )}
          Add to cart
          <span className="sr-only">Add to cart</span>
        </Button>
      </form>
    </Form>
  )
}
