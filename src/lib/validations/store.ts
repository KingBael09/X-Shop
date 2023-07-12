import { z } from "zod"

export const storeSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Store name should be atleast be 3 characters long" })
    .max(50, { message: "Store name should be less than 50 characters" }),
  description: z
    .string()
    .min(3, {
      message: "Store description should be atleast be 3 characters long",
    })
    .max(255, {
      message: "Store description should be less than 255 characters",
    }),
})

export type ZStoreSchema = z.infer<typeof storeSchema>
