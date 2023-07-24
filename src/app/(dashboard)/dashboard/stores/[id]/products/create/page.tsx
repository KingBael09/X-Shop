import type { Metadata } from "next"
import { env } from "@/env.mjs"

import { db } from "@/lib/db"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"
import { AddProductForm } from "@/components/forms/add-product-form"

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

  const categories = await db.query.categories.findMany()
  // TODO: UKW this shit can be cached

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
