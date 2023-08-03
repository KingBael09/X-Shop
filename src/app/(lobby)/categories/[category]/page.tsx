import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"

import { getProductAction } from "@/lib/actions/product"
import { getStoresAction } from "@/lib/actions/store"
import { db } from "@/lib/db"
import { categories } from "@/lib/db/schema"
import {
  getProductSearchParams,
  type SearchParams,
} from "@/lib/helpers/products"
import { ProductCard } from "@/components/product-card"
import { ProductsLayoutWrapper } from "@/components/products-layout-wrapper"

interface CategoryPageProps {
  params: {
    category: string
  }
  searchParams: SearchParams
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.name, params.category),
  })

  if (!category) {
    notFound()
  }

  const { store_page, ...rest } = getProductSearchParams(searchParams, 9)
  const { items: products, total } = await getProductAction({
    ...rest,
    category_ids: String(category.id),
  })

  const pageCount = Math.ceil(total / rest.limit)

  const storesLimit = 25
  const storeOffset = store_page * storesLimit

  const { items: stores, total: storeQty } = await getStoresAction({
    limit: storesLimit,
    offset: storeOffset,
    sort: "productCount.desc",
  })

  const storePageCount = Math.ceil(storeQty / storesLimit)

  return (
    <ProductsLayoutWrapper
      stores={stores}
      items={products.length}
      pageCount={pageCount}
      storePageCount={storePageCount}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard enableAction key={product.id} product={product} />
        ))}
      </div>
    </ProductsLayoutWrapper>
  )
}
