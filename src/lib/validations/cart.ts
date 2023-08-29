import { z } from "zod"

export const cartSchema = z.object({
  quantity: z.number().min(0).default(1),
})

export type ZCartSchema = z.infer<typeof cartSchema>

export const cartItemSchema = z.object({
  productId: z.coerce.number(),
  quantity: z.number().min(0),
  productSubcategory: z.string().optional().nullable(),
})

export type ZCartItemSchema = z.infer<typeof cartItemSchema>
