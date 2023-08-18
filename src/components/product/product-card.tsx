import Image from "next/image"
import Link from "next/link"
import { Icons } from "@/util/icons"

import type { Product } from "@/lib/db/schema"
import { cn, formatPrice } from "@/lib/utils"
import { AspectRatio } from "@/ui/aspect-ratio"
import { Button, buttonVariants } from "@/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card"
import { AddToCartButton } from "@/components/custom/product-add-to-cart-button"

import { ImagePlaceHolder } from "../no-image"

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product
  enableAction?: boolean
  enableFav?: boolean
}

export function ProductCard({
  product,
  className,
  enableAction = false,
  enableFav = false,
  ...props
}: ProductCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)} {...props}>
      <Link
        aria-label={`View ${product.name} details`}
        href={`/products/${product.id}`}
      >
        <AspectRatio className="relative" ratio={1}>
          {product.images && product.images?.length > 0 ? (
            <Image
              fill
              loading="lazy"
              className="object-cover"
              src={product.images[0]?.url ?? "/product-placeholder.webp"}
              alt={product.images[0]?.name ?? product.name}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <ImagePlaceHolder />
          )}
        </AspectRatio>
        <CardHeader className="p-4">
          <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {formatPrice(product.price)}
          </CardDescription>
        </CardHeader>
      </Link>
      {enableAction && enableFav && (
        <Button
          className="absolute right-1 top-1 h-auto w-auto rounded-full p-2"
          size="icon"
          variant="outline"
        >
          <Icons.heart className="h-5 w-5" />
        </Button>
      )}
      {enableAction && (
        <CardFooter className="flex gap-2 p-4 pt-0">
          <Link
            scroll={false}
            href={`/preview-product/${product.id}`}
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Preview
          </Link>
          <AddToCartButton productId={product.id} className="w-full">
            Add to Cart
          </AddToCartButton>
        </CardFooter>
      )}
    </Card>
  )
}

// TODO: Give buttons for preview and to add to favaurites
// TODO: Set next/image sizes to optimize images
