import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
// import { AddToCartForm } from "@/forms/add-to-cart-form"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { formatPrice } from "@/lib/utils"
import { AspectRatio } from "@/ui/aspect-ratio"
import { Label } from "@/ui/label"
import { Header } from "@/components/header"
import { Modal } from "@/components/modal/modal"
import { ProductImageCarousel } from "@/components/product/product-image-carousel"
import { buttonVariants } from "@/components/ui/button"

import { ModalLink } from "../../../../../components/modal/modal-link"

export interface ProductPreviewPageProps {
  params: {
    productId: string
  }
}

// const AddToCartForm = dynamic(() =>
//   import("@/forms/add-to-cart-form").then((mod) => mod.AddToCartForm)
// )

export default async function ProductPreviewPage({
  params,
}: ProductPreviewPageProps) {
  const productId = Number(params.productId)

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      store: {
        columns: {
          name: true,
        },
      },
    },
  })

  if (!product) {
    return notFound()
  }

  const title = (
    <Header title={product.name} description={product.store.name} size="sm" />
  )

  return (
    <Modal title={title}>
      <ProductImageCarousel
        className="w-full px-3"
        images={product.images ?? []}
      >
        {product.images?.map((image, index) => (
          <div className="relative min-w-0 flex-full pl-4" key={index}>
            <AspectRatio ratio={1}>
              <Image
                fill
                key={index}
                role="group"
                src={image.url}
                alt={image.name}
                priority={index === 0}
                className="!cursor-default object-cover"
                aria-label={`Slide ${index + 1} of ${
                  product.images?.length as number
                }`}
                sizes="100vw"
                aria-roledescription="slide"
              />
            </AspectRatio>
          </div>
        ))}
      </ProductImageCarousel>
      <div className="space-y-2">
        <Label>Description</Label>
        <p className="text-muted-foreground">
          {product.description && product.description.length > 0
            ? product.description
            : "No description available"}
          {/* //TODO: This would not have happened if the form didn't have default description as "" */}
        </p>
      </div>
      <div className="space-y-2">
        <Label>Price</Label>
        <p className="font-bold text-muted-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
      {/* <Link
        replace
        className={buttonVariants()}
        href={`/products/${product.id}`}
      >
        View Product
      </Link> */}
      <ModalLink href={`/products/${product.id}`}>View Products</ModalLink>
    </Modal>
  )
}

// TODO: replace [key:string]:string --> Record<string, string>
