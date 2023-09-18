import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { and, asc, desc, eq, inArray, like, sql } from "drizzle-orm"

import { db } from "@/lib/db"
import { products, stores, type Product } from "@/lib/db/schema"
import type { SearchParams } from "@/lib/helpers/products"
import { ProductsTableShell } from "@/components/shells/products-table-shell"

interface ProductsPageProps {
  params: {
    id: string
  }
  searchParams: SearchParams
}

export const metadata: Metadata = {
  title: "Products",
  description: "See all products in the store",
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const storeId = Number(params.id)

  const { page, per_page, sort, name, category } = searchParams

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    columns: {
      id: true,
      name: true,
    },
  })

  if (!store) {
    notFound()
  }

  // Number of pages per page
  const limit = typeof per_page === "string" ? parseInt(per_page) : 10
  // Number of items to skip
  const offset =
    typeof page === "string"
      ? parseInt(page) > 0
        ? (parseInt(page) - 1) * limit
        : 0
      : 0

  // Column and order to sort by
  const [column, order] =
    typeof sort === "string"
      ? (sort.split(".") as [
          keyof Product | undefined,
          "asc" | "desc" | undefined,
        ])
      : []

  // getting all categories
  const categoryList = await db.query.categories.findMany({
    columns: {
      id: true,
      name: true,
    },
  })

  const categories = typeof category === "string" ? category.split(".") : []

  const categoriesIds: number[] = []

  categoryList.forEach((item) => {
    if (categories.includes(item.name)) {
      categoriesIds.push(item.id)
    }
  })

  // Using transaction to ensure that both queries are executed in single transaction
  const { storeProducts, totalProducts } = await db.transaction(async (tx) => {
    const storeProducts = await tx.query.products.findMany({
      limit,
      offset,
      where: and(
        eq(products.storeId, storeId),
        // Filter by name
        typeof name === "string" ? like(products.name, `%${name}%`) : undefined,
        // Filter by category
        categoriesIds.length > 0
          ? inArray(products.categoryId, categoriesIds)
          : undefined
      ),
      with: {
        category: {
          columns: { name: true, id: true },
        },
      },
      orderBy:
        column && column in products
          ? order === "asc"
            ? asc(products[column])
            : desc(products[column])
          : desc(products.createdAt),
    })

    const totalProducts = await tx
      .select({
        count: sql<number>`count(${products.id})`,
      })
      .from(products)
      .where(
        and(
          eq(products.storeId, storeId),
          typeof name === "string"
            ? like(products.name, `%${name}%`)
            : undefined,

          categoriesIds.length > 0
            ? inArray(products.categoryId, categoriesIds)
            : undefined
        )
      )
      .all()
      .then((res) => res[0]?.count ?? 0)

    return {
      storeProducts,
      totalProducts,
    }
  })

  const pageCount = Math.ceil(totalProducts / limit)

  return (
    <ProductsTableShell
      data={storeProducts}
      count={pageCount}
      storeId={storeId}
      categories={categoryList}
    />
  )
}
