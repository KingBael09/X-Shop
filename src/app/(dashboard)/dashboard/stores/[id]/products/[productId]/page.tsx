import { notFound } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { UpdateProductForm } from "@/components/forms/update-product-form"

export interface EditProductPageProps {
  params: {
    productId: string
    id: string
  }
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const storeId = Number(params.id)
  const productId = Number(params.productId)

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.storeId, storeId)),
  })

  const categories = await db.query.categories.findMany() //Think of a way to not refetch this call

  if (!product) return notFound()

  return <UpdateProductForm product={product} categories={categories} />
}
