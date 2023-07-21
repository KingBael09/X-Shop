import { z } from "zod"

export const productSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Product name must be atleast 2 characters long" })
    .max(50, {
      message: "Product name should be no more than 50 characters long",
    }),
  description: z
    .string()
    .max(255, {
      message: "Description should be no more than 255 characters long",
    })
    .optional(),
  categoryId: z.string({ required_error: "Please select a category" }),
  subcategory: z
    .string({ required_error: "Please select a subcategory" })
    .optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Must be a valid price",
  }),
  inventory: z
    .string({
      required_error: "Enter available quantity",
    })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Must be a quantity",
    }),
  images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false
      if (val.some((file) => !(file instanceof File))) return false
      return true
    }, "Must be an array of files")
    .optional()
    .nullable()
    .default(null),
})

export type ZProductSchema = z.infer<typeof productSchema>

export const getProductSchema = z.object({
  limit: z.number().min(0).default(10),
  offset: z.number().min(0).default(0),
  category_ids: z
    .string()
    .regex(/^\d+.\d+$/)
    .optional()
    .nullable(),
  sort: z
    .string()
    .regex(/^\w+.(asc|desc)$/)
    .optional()
    .nullable(),
  price_range: z
    .string()
    .regex(/^\d+-\d+$/)
    .optional()
    .nullable(),
  store_ids: z
    .string()
    .regex(/^\d+.\d+$/)
    .optional()
    .nullable(),
})

export type ZGetProductSchema = z.infer<typeof getProductSchema>
