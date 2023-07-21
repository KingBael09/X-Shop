import { getProductAction } from "@/lib/actions/product"
import { getStoresAction } from "@/lib/actions/store"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { ProductsLayoutWrapper } from "@/components/products-layout-wrapper"
import { Shell } from "@/components/shells/shell"

interface SearchParams {
  [key: string]: string | string[] | undefined
}
interface AllProductsPageProps {
  searchParams: SearchParams
}

export default async function AllProductsPage({
  searchParams,
}: AllProductsPageProps) {
  const { store_page, ...params } = getParams(searchParams)
  const { items: products, total } = await getProductAction(params)

  const pageCount = Math.ceil(total / params.limit)

  const storesLimit = 25
  const storeOffset = store_page * storesLimit

  const { items: stores, total: storeQty } = await getStoresAction({
    limit: storesLimit,
    offset: storeOffset,
    sort: "productCount.desc",
  })

  const storePageCount = Math.ceil(storeQty / storesLimit)

  return (
    <Shell>
      <Header
        title="Products"
        description="Buy products from our stores"
        size="sm"
      />
      <ProductsLayoutWrapper items={products.length}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard enableAction key={product.id} product={product} />
          ))}
        </div>
      </ProductsLayoutWrapper>
    </Shell>
  )
}

/**
 * This requires the follwing params
 * - page
 * - per_page
 * - sort
 * - category_ids
 * - price_range
 * - store_ids
 * - store_page
 */
function getParams(searchParams: SearchParams) {
  const limit =
    typeof searchParams.per_page === "string"
      ? parseInt(searchParams.per_page)
      : 8
  const offset =
    typeof searchParams.page === "string"
      ? (parseInt(searchParams.page) - 1) * limit
      : 0
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : null

  const category_ids =
    typeof searchParams.categories === "string" ? searchParams.categories : null
  const price_range =
    typeof searchParams.price_range === "string"
      ? searchParams.price_range
      : null
  const store_ids =
    typeof searchParams.store_ids === "string" ? searchParams.store_ids : null

  const store_page =
    typeof searchParams.store_page === "string"
      ? parseInt(searchParams.store_page) - 1
      : 0

  return {
    limit,
    offset,
    sort,
    category_ids,
    price_range,
    store_ids,
    store_page,
  }
}
