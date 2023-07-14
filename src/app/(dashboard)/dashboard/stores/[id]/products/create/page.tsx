import { db } from "@/lib/db"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AddProductForm } from "@/components/forms/add-product-form"

interface NewProductPageProps {
  params: {
    id: string
  }
}
export default async function CreateProductPage({
  params,
}: NewProductPageProps) {
  const storeId = Number(params.id)

  // TODO: UKW this shit can be cached
  const categories = await db.query.categories.findMany()

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
