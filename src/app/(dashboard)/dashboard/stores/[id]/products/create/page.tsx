import type { Metadata } from "next"
import { env } from "@/env.mjs"
import { AddProductForm } from "@/forms/add-product-form"

import { getAllCategoriesAction } from "@/lib/actions/category"

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

  const categories = await getAllCategoriesAction() //TODO: We gotta cache this

  return <AddProductForm storeId={storeId} categories={categories} />
}

// FIXME: 248kb first load size
