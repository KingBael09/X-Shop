import { notFound } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { products, stores } from "@/lib/db/schema"

interface EditProductPageProps {
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
    where: and(eq(products.id, productId), eq(stores.id, storeId)),
  })

  if (!product) return notFound()

  return <div></div>
}
