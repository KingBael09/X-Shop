import { notFound } from "next/navigation"
import dayjs from "dayjs"
import { and, asc, desc, eq, gte, like, lte, sql } from "drizzle-orm"

import { db } from "@/lib/db"
import { type Product, products, stores } from "@/lib/db/schema"
import { ProductsTableShell } from "@/components/shells/products-table-shell"

interface ProductsPageProps {
  params: {
    id: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const storeId = Number(params.id)

  const { page, per_page, sort, name, date_range } = searchParams

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
          "asc" | "desc" | undefined
        ])
      : []
  // Date range for created date
  const [start_date, end_date] =
    typeof date_range === "string"
      ? date_range.split("to").map((date) => dayjs(date).toDate())
      : []

  // Using transaction to ensure that both queries are executed in single transaction
  const { storeProducts, totalProducts } = await db.transaction(async (tx) => {
    // const storeProducts = await tx
    //   .select()
    //   .from(products)
    //   .limit(limit)
    //   .offset(offset)
    //   .where(
    //     and(
    //       eq(products.storeId, storeId),
    //       // Filter by name
    //       typeof name === "string"
    //         ? like(products.name, `%${name}%`)
    //         : undefined,
    //       // Filter by created date
    //       start_date && end_date
    //         ? and(
    //             gte(products.createdAt, start_date),
    //             lte(products.createdAt, end_date)
    //           )
    //         : undefined
    //     )
    //   )
    //   .orderBy(
    //     column && column in products
    //       ? order === "asc"
    //         ? asc(products[column])
    //         : desc(products[column])
    //       : desc(products.createdAt)
    //   )
    //   .all()

    const storeProducts = await tx.query.products.findMany({
      limit,
      offset,
      where: and(
        eq(products.storeId, storeId),
        // Filter by name
        typeof name === "string" ? like(products.name, `%${name}%`) : undefined,
        // Filter by created date
        start_date && end_date
          ? and(
              gte(products.createdAt, start_date),
              lte(products.createdAt, end_date)
            )
          : undefined
      ),
      with: {
        category: {
          columns: { name: true },
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
          start_date && end_date
            ? and(
                gte(products.createdAt, start_date),
                lte(products.createdAt, end_date)
              )
            : undefined
        )
      )
      .all()

    return {
      storeProducts,
      totalProducts: Number(totalProducts[0]?.count) ?? 0,
    }
  })

  const pageCount = Math.ceil(totalProducts / limit)

  return (
    <ProductsTableShell data={storeProducts} count={pageCount} id={storeId} />
  )
}
