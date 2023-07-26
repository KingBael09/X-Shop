"use client"

import { Fragment } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { SelectContent } from "@radix-ui/react-select"
import { useForm } from "react-hook-form"

import type { CustomCartItem } from "@/lib/actions/cart"
import {
  checkoutSchema,
  paymentMethods,
  type ZCheckoutSchema,
} from "@/lib/actions/checkout"
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
  cart: CustomCartItem[]
}

export function CheckoutForm({}: CheckoutFormProps) {
  const form = useForm<ZCheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      mail: "",
      address: "",
      mode: "Cash",
    },
  })

  function onSubmit(values: ZCheckoutSchema) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-xl gap-5"
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
                <Textarea placeholder="Enter your address here!" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>Place order</Button>
      </form>
    </Form>
  )
}
