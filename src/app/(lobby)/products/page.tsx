import { getProductAction } from "@/lib/actions/product"
import { getStoresAction } from "@/lib/actions/store"
import { getCachedCategoriesAction } from "@/lib/helpers/categories"
import {
  getProductSearchParams,
  type SearchParams,
} from "@/lib/helpers/products"
import { toTitleCase } from "@/lib/utils"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product/product-card"
import { ProductsLayoutWrapper } from "@/components/product/wrapper/products-layout-wrapper"

// import { Shell } from "@/components/shells/shell"

interface AllProductsPageProps {
  searchParams: SearchParams
}

export default async function AllProductsPage({
  searchParams,
}: AllProductsPageProps) {
  const { store_page, ...params } = getProductSearchParams(searchParams)
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

  const categories = await getCachedCategoriesAction()

  const shapedCategories = categories.map((c) => ({
    label: toTitleCase(c.name),
    value: c.id,
  }))

  return (
    <>
      <Header
        title="Products"
        description="Buy products from our stores"
        size="sm"
      />
      <ProductsLayoutWrapper
        categories={shapedCategories}
        stores={stores}
        items={products.length}
        pageCount={pageCount}
        storePageCount={storePageCount}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard enableAction key={product.id} product={product} />
          ))}
        </div>
      </ProductsLayoutWrapper>
    </>
  )
}
