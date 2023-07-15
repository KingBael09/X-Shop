import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, "Category name shuould be alteast 1 character long"),
})

export type ZCategorySchema = z.infer<typeof categorySchema>

export const subCategorySchema = z.object({
  categoryId: z.string().regex(/[0-9]+/),
  name: z.string().min(1, { message: "Subcategory name too short" }),
})

export type ZSubCategorySchema = z.infer<typeof subCategorySchema>
