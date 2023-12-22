"use client"

import { Fragment, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { OrderItem } from "@/types"
import { Icons } from "@/util/icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { placeOrderAction } from "@/lib/actions/order"
import { catchError } from "@/lib/utils"
import {
  checkoutSchema,
  paymentMethods,
  type ZCheckoutSchema,
} from "@/lib/validations/checkout"
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
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group"
import { Textarea } from "@/ui/textarea"

interface CheckoutFormProps {
  cart: OrderItem[]
  storeIds: number[]
}

export function CheckoutForm({ cart, storeIds }: CheckoutFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const form = useForm<ZCheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      mail: "",
      address: "",
      mode: "Cash",
    },
  })

  function onSubmit(data: ZCheckoutSchema) {
    startTransition(async () => {
      try {
        await placeOrderAction(data, cart, storeIds)
        toast.success("Order Placed Successfully")
        router.push("/")
      } catch (error) {
        catchError(error)
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name here!" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mail</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name here!" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    {paymentMethods.options.map((option) => (
                      <Fragment key={option}>
                        <FormControl>
                          <RadioGroupItem
                            disabled={option !== "Cash"}
                            // TODO: For now cash is the only available option
                            value={option}
                          />
                        </FormControl>
                        <FormLabel>{option}</FormLabel>
                      </Fragment>
                    ))}
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Enter your address here!"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>
          {isPending && (
            <Icons.spinner className="mr-2 size-4 animate-spin" aria-hidden />
          )}
          Place Order
          <span className="sr-only">Place Orders</span>
        </Button>
      </form>
    </Form>
  )
}
