import { z } from "zod"

export const paymentMethods = z.enum(["Card", "Cash", "UPI"])

export const checkoutSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name should be at least 1 character" })
    .max(50, {
      message: "Name should be less than 50 characters",
    }),
  mail: z.string().email({ message: "Email is not valid" }),
  mode: paymentMethods,
  address: z
    .string()
    .min(1, { message: "Address should be at least 1 character" })
    .max(255, { message: "Address should be less than 255 characters" }),
})

export type ZCheckoutSchema = z.infer<typeof checkoutSchema>
