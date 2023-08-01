import type { Metadata } from "next"
import { env } from "@/env.mjs"
import { AddProductForm } from "@/forms/add-product-form"

import { getCachedCategoriesAction } from "@/lib/helpers/categories"

interface NewProductPageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Create Product",
  description: "Create a new product for your store",
}

export default async function CreateProductPage({
  params,
}: NewProductPageProps) {
  const storeId = Number(params.id)

  const categories = await getCachedCategoriesAction()

  return <AddProductForm storeId={storeId} categories={categories} />
}
