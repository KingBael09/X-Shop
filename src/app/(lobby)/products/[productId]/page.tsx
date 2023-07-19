import { notFound } from "next/navigation"
import { and, eq, not } from "drizzle-orm"

import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { toTitleCase } from "@/lib/utils"
import { Breadcrumbs, type BreadSegment } from "@/components/pagers/breadcrumbs"
import { Shell } from "@/components/shells/shell"

interface ProductPageParams {
  params: {
    productId: string
  }
}

export default async function ProductPage({ params }: ProductPageParams) {
  const productId = Number(params.productId)
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      store: {
        columns: { name: true },
      },
      category: {
        columns: { name: true },
      },
    },
  })

  if (!product) {
    notFound()
  }

  const productWithSameStore = await db.query.products.findMany({
    where: and(
      eq(products.storeId, product.storeId),
      not(eq(products.id, product.id))
    ),
    limit: 5,
  })

  const segments: BreadSegment[] = [
    {
      title: "Products",
      href: "/products",
    },
    {
      title: toTitleCase(product.store.name),
      href: `/products?category=${product.category.name}`,
    },
    {
      title: product.name,
      href: `/products/${product.id}`,
    },
  ]

  return (
    <Shell>
      <Breadcrumbs segments={segments} />
      <div>lol</div>
      {productWithSameStore.length > 0 && (
        <div className="overflow-hidden">
          <h2 className="line-clamp-1 text-2xl font-bold">
            More products from {product.store.name}
          </h2>
          <div className="overflow-x-auto">
            <div className="flex gap-4">
              {productWithSameStore.map((prod) => (
                <div key={prod.id}>{prod.name}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Shell>
  )
}

// TODO: Not Found throws error -> Error: invariant expected app router to be mounted
