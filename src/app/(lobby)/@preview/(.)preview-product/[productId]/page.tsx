import Image from "next/image"
import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { formatPrice } from "@/lib/utils"
import { AspectRatio } from "@/ui/aspect-ratio"
import { Label } from "@/ui/label"
import { Header } from "@/components/header"
import { Modal } from "@/components/modal/modal"
import { ModalLink } from "@/components/modal/modal-link"
import { ProductImageCarousel } from "@/components/product/product-image-carousel"

export interface ProductPreviewPageProps {
  params: {
    productId: string
  }
}

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
        placeHolderProps={{ className: "md:w-full" }}
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
                aria-label={`Slide ${index + 1} of ${product.images?.length}`}
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
      <ModalLink href={`/products/${product.id}`}>View Products</ModalLink>
    </Modal>
  )
}
