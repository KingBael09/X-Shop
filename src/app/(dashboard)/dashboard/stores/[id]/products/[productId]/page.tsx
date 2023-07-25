import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { UpdateProductForm } from "@/forms/update-product-form"
import { and, eq } from "drizzle-orm"

import { getAllCategoriesAction } from "@/lib/actions/category"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"

export interface EditProductPageProps {
  params: {
    productId: string
    id: string
  }
}

export const metadata: Metadata = {
  title: "Update Product",
  description: "Update your product",
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const storeId = Number(params.id)
  const productId = Number(params.productId)

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.storeId, storeId)),
  })

  const categories = await getAllCategoriesAction()

  if (!product) return notFound()

  return <UpdateProductForm product={product} categories={categories} />
}
