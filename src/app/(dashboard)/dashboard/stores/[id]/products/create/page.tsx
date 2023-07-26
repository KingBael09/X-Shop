import type { Metadata } from "next"
import { env } from "@/env.mjs"
import { AddProductForm } from "@/forms/add-product-form"

import { getAllCategoriesAction } from "@/lib/actions/category"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"

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

  const categories = await getAllCategoriesAction()

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add product</CardTitle>
        <CardDescription>Add a new product to your store</CardDescription>
      </CardHeader>
      <CardContent>
        <AddProductForm storeId={storeId} categories={categories} />
      </CardContent>
    </Card>
  )
}

// FIXME: 248kb first load size
