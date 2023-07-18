import type { LayoutProps } from "@/types"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProductPager } from "@/components/pagers/product-pager"

import type { EditProductPageProps } from "./page"

type EditProductPageLayoutProps = EditProductPageProps & LayoutProps

// ? Taking out all products pager into layout to reduce db calls

export default async function EditProductPageLayout({
  children,
  params,
}: EditProductPageLayoutProps) {
  const storeId = Number(params.id)
  const productId = Number(params.productId)

  const allProducts = await db.query.products.findMany({
    where: eq(products.storeId, storeId),
  })

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between space-x-2">
          <CardTitle className="text-2xl">Update product</CardTitle>
          <ProductPager
            products={allProducts}
            currentId={productId}
            storeId={storeId}
          />
        </div>
        <CardDescription>
          Update your product information, or delete it
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
