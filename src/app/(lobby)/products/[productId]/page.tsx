import type { Route } from "next"
import dynamic from "next/dynamic"
import Image from "next/image"
import { notFound } from "next/navigation"
import { AddToCartForm } from "@/forms/add-to-cart-form"
import { and, desc, eq, not } from "drizzle-orm"

import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { formatPrice, toTitleCase } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion"
import { Separator } from "@/ui/separator"
import { ModLink } from "@/components/mod-link"
import { Breadcrumbs, type BreadSegment } from "@/components/pagers/breadcrumbs"
import { ProductCardLoader } from "@/components/product/product-card-loader"
import { ProductImageCarousel } from "@/components/product/product-image-carousel"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Zoom } from "@/components/zoom-image"

interface ProductPageParams {
  params: {
    productId: string
  }
}

const ProductCard = dynamic(
  () =>
    import("@/components/product/product-card").then((mod) => mod.ProductCard),
  { loading: () => <ProductCardLoader /> }
)

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

  if (!product) return notFound()

  const productWithSameStore = await db.query.products.findMany({
    where: and(
      eq(products.storeId, product.storeId),
      not(eq(products.id, product.id))
    ),
    limit: 5,
    orderBy: desc(products.createdAt),
  })

  const segments: BreadSegment[] = [
    {
      title: "Products",
      href: "/products",
    },
    {
      title: toTitleCase(product.store.name),
      href: `/products?store_ids=${product.storeId}`,
    },
    {
      title: product.name,
      href: `/products/${product.id}` as Route,
    },
  ]

  return (
    <>
      <Breadcrumbs segments={segments} />
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <ProductImageCarousel
          className="w-full md:w-1/2"
          images={product.images ?? []}
        >
          {product.images?.map((image, index) => (
            <div className="relative min-w-0 flex-full pl-4" key={index}>
              <Zoom margin={10}>
                <AspectRatio ratio={1}>
                  <Image
                    fill
                    key={index}
                    role="group"
                    src={image.url}
                    alt={image.name}
                    priority={index === 0}
                    className="!cursor-default object-cover md:object-contain"
                    aria-label={`Slide ${index + 1} of ${product.images
                      ?.length}`}
                    sizes="100vw"
                    aria-roledescription="slide"
                  />
                </AspectRatio>
              </Zoom>
            </div>
          ))}
        </ProductImageCarousel>
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-2">
            <h2 className="line-clamp-1 text-2xl font-bold">{product.name}</h2>
            <p className="text-muted-foreground">
              {formatPrice(product.price)}
            </p>
            <ModLink
              disabled={productWithSameStore.length < 0}
              variant="link"
              href={`/products?store_ids=${product.storeId}`}
              className="h-auto p-0 text-base font-normal text-muted-foreground"
            >
              {product.store.name}
            </ModLink>
          </div>
          <Separator className="my-1.5" />
          <AddToCartForm productId={product.id} />
          <Separator className="my-1.5" />
          <Accordion
            defaultValue={product.description ? "description" : undefined}
            type="single"
            collapsible
            className="w-full"
          >
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                {product.description && product.description.length > 0
                  ? product.description
                  : "No description available"}
                {/* //TODO: This would not have happened if the form didn't have default description as "" */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      {productWithSameStore.length > 0 && (
        <div className="space-y-6 overflow-hidden">
          <h2 className="line-clamp-1 text-2xl font-bold">
            More products from {product.store.name}
          </h2>
          <div className="overflow-x-auto">
            <div className="flex gap-4">
              {productWithSameStore.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  className="min-w-[260px]"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
