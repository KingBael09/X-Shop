import Image from "next/image"
import Link from "next/link"
import { OrderItem } from "@/types"

import { getCartAction } from "@/lib/actions/cart"
import { cn, formatPrice } from "@/lib/utils"
import { CardContent, CardDescription } from "@/ui/card"
import { UpdateCart } from "@/components/cart/update-cart"
import { CheckoutForm } from "@/components/forms/checkout-form"
import { Header } from "@/components/header"
import { ImagePlaceHolder } from "@/components/no-image"
import { Shell } from "@/components/shells/shell"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/util/icons"

export default async function CheckOutPage() {
  const cartItems = await getCartAction()

  const count = cartItems.reduce(
    (total, item) => total + Number(item.quantity),
    0
  )

  const total = cartItems.reduce(
    (total, item) => total + item.price * Number(item.quantity),
    0
  )

  const storeIds = [...new Set(cartItems.map((item) => item.storeId))]

  const items = cartItems.map((i) => ({
    productId: String(i.id),
    quantity: Number(i.quantity),
  })) satisfies OrderItem[]

  if (count === 0) {
    return (
      <div className="my-auto flex flex-col items-center justify-center space-y-2">
        <Icons.cart className="h-12 w-12 text-muted-foreground" aria-hidden />
        <span className="text-lg font-medium text-muted-foreground">
          Your cart is empty
        </span>

        <Link
          href="/products"
          className={cn(buttonVariants({ variant: "outline" }), "h-auto")}
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <Shell>
      <Header
        title="Checkout"
        description="Fill information to place your order"
        size="sm"
      />
      <div className="flex flex-col-reverse gap-6 md:flex-row">
        <div className="flex-1">
          <CheckoutForm cart={items} storeIds={storeIds} />
        </div>
        <div className="grid flex-1 gap-2">
          {cartItems.map((item) => (
            <Card key={item.id} className="flex">
              <div className="relative h-full w-32 overflow-hidden rounded">
                {item?.images?.length ? (
                  <Image
                    fill
                    src={
                      item.images[0]?.url ?? "/images/product-placeholder.webp"
                    }
                    alt={item.images[0]?.name ?? item.name}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="absolute object-cover"
                  />
                ) : (
                  <ImagePlaceHolder iconProps={{ className: "h-4 w-4" }} />
                )}
              </div>
              <div className="flex flex-1 flex-col md:flex-row">
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>
                    Price: {formatPrice(item.price)}
                  </CardDescription>
                  <span className="font-bold">
                    {formatPrice(
                      (Number(item.price) * Number(item.quantity)).toFixed(2)
                    )}
                  </span>
                </CardHeader>
                <CardContent className="mx-auto grid md:p-0">
                  <UpdateCart item={item} />
                </CardContent>
              </div>
            </Card>
          ))}
          <Card className="my-2">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Cart Total ({count})</span>
                <span>{formatPrice(total.toFixed(2))}</span>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </Shell>
  )
}