import { Suspense } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AddToCartForm } from "@/forms/add-to-cart-form"
import { Await } from "@/util/await-component"
import { and, desc, eq, not } from "drizzle-orm"

import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { cn, formatPrice, toTitleCase } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion"
import { AspectRatio } from "@/ui/aspect-ratio"
import { buttonVariants } from "@/ui/button"
import { Separator } from "@/ui/separator"
import { Breadcrumbs, type BreadSegment } from "@/components/pagers/breadcrumbs"
import { ProductCard } from "@/components/product/product-card"
import { ProductCardLoader } from "@/components/product/product-card-loader"
import { ProductImageCarousel } from "@/components/product/product-image-carousel"
import { Zoom } from "@/components/zoom-image"

interface ProductPageParams {
  params: {
    productId: string
  }
}

async function getRelatedProducts(productId: number, storeId: number) {
  return await db.query.products.findMany({
    where: and(eq(products.storeId, storeId), not(eq(products.id, productId))),
    limit: 5,
    orderBy: desc(products.createdAt),
  })
}

function RelatedProductsLoading() {
  return (
    <div className="space-y-6 overflow-hidden">
      <h2 className="line-clamp-1 text-2xl font-bold">
        More products from Store
      </h2>
      <div className="overflow-x-auto">
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCardLoader key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({
  params,
}: ProductPageParams): Promise<Metadata> {
  const productId = Number(params.productId)

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
    columns: {
      name: true,
      description: true,
      images: true,
    },
  })

  if (!product) return {}

  return {
    title: product.name,
    description: product.description,
    openGraph: { images: product.images?.map((e) => e.url) },
    twitter: { images: product.images?.map((e) => e.url) },
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

  if (!product) return notFound()

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
      href: `/products/${product.id}`,
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
                    aria-label={`Slide ${index + 1} of ${
                      product.images?.length
                    }`}
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
            <Link
              href={`/products?store_ids=${product.storeId}`}
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "h-auto p-0 text-sm font-normal text-muted-foreground"
              )}
            >
              {product.store.name}
            </Link>
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
      <Suspense fallback={<RelatedProductsLoading />}>
        <Await promise={getRelatedProducts(product.id, product.storeId)}>
          {(products) =>
            products.length > 0 && (
              <div className="space-y-6 overflow-hidden">
                <h2 className="line-clamp-1 text-2xl font-bold">
                  More products from {product.store.name}
                </h2>
                <div className="overflow-x-auto">
                  <div className="flex gap-4">
                    {products.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        className="min-w-[260px]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )
          }
        </Await>
      </Suspense>
    </>
  )
}
