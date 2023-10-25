import { z } from "zod"

export const productPageSearchParams = z.object({
  page: z.coerce.number().min(1).optional().default(1).transform(String),
  per_page: z.coerce.number().min(1).optional().default(8).transform(String),
  sort: z.string().optional().default("createdAt.desc"),
  store_ids: z.string().nullish(),
  store_page: z.coerce.number().min(1).optional().default(1).transform(String),
  category_ids: z.string().nullish(),
  price_range: z.string().optional(),
  categories: z.string().nullish(),
  subcategories: z.string().nullish(),
})

export type ProductPageSearchParams = z.infer<typeof productPageSearchParams>

export const dataTableSearchParams = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  per_page: z.coerce.number().min(1).optional().default(10),
  sort: z.string().nullish(),
})

export type DataTableSearchParams = z.infer<typeof dataTableSearchParams>
