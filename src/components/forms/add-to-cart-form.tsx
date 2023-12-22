"use client"

import { useTransition } from "react"
import { Icons } from "@/util/icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { addToCartAction } from "@/lib/actions/cart"
import { catchError, cn } from "@/lib/utils"
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

interface AddToCartFormProps extends React.HTMLAttributes<HTMLFormElement> {
  productId: number
}

export function AddToCartForm({
  productId,
  className,
  ...props
}: AddToCartFormProps) {
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
          productId: productId,
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
        className={cn("grid gap-4 sm:max-w-[240px]", className)}
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        {...props}
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
            <Icons.spinner className="mr-2 size-4 animate-spin" aria-hidden />
          )}
          Add to cart
          <span className="sr-only">Add to cart</span>
        </Button>
      </form>
    </Form>
  )
}
