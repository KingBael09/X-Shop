import Image from "next/image"
import Link from "next/link"
import { Icons } from "@/util/icons"
import { currentUser } from "@clerk/nextjs"

import { getCartAction } from "@/lib/actions/cart"
import { cn, formatPrice } from "@/lib/utils"
import { Badge } from "@/ui/badge"
import { Button, buttonVariants } from "@/ui/button"
import { ScrollArea } from "@/ui/scroll-area"
import { Separator } from "@/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/sheet"

import { ImagePlaceHolder } from "../no-image"
import { UpdateCart } from "./update-cart"

export async function CartSheet() {
  const user = await currentUser()

  if (!user) return null

  const cartItems = await getCartAction()

  const count = cartItems.reduce(
    (total, item) => total + Number(item.quantity),
    0
  )

  const total = cartItems.reduce(
    (total, item) => total + item.price * Number(item.quantity),
    0
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Cart"
          variant="outline"
          size="icon"
          className="relative"
        >
          {count > 0 && (
            <Badge
              variant="secondary"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-2"
            >
              {count}
            </Badge>
          )}
          <Icons.cart className="h-4 w-4" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>Cart {count > 0 && `(${count})`}</SheetTitle>
        </SheetHeader>
        <Separator />
        {count > 0 ? (
          <>
            <div className="flex flex-1 flex-col gap-5 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-5 pr-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded">
                          {item?.images?.length ? (
                            <Image
                              fill
                              src={
                                item.images[0]?.url ??
                                "/images/product-placeholder.webp"
                              }
                              alt={item.images[0]?.name ?? item.name}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="absolute object-cover"
                            />
                          ) : (
                            <ImagePlaceHolder
                              iconProps={{ className: "h-4 w-4" }}
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row">
                          <div className="flex flex-1 flex-col gap-1 self-start text-sm">
                            <span className="line-clamp-1">{item.name}</span>
                            <span className="line-clamp-1 text-muted-foreground">
                              {formatPrice(item.price)} x {item.quantity} ={" "}
                              {formatPrice(
                                (
                                  Number(item.price) * Number(item.quantity)
                                ).toFixed(2)
                              )}
                            </span>
                            <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
                              {`${item.category.name} ${
                                item.subcategory ? `/ ${item.subcategory}` : ""
                              }`}
                            </span>
                          </div>
                          <UpdateCart item={item} />
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="grid gap-1.5 pr-6 text-sm">
              <Separator className="mb-2" />
              <div className="flex">
                <span className="flex-1">Subtotal</span>
                <span>{formatPrice(total.toFixed(2))}</span>
              </div>
              <div className="flex">
                <span className="flex-1">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex">
                <span className="flex-1">Taxes</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator className="mt-2" />
              <div className="flex">
                <span className="flex-1">Total</span>
                <span>{formatPrice(total.toFixed(2))}</span>
              </div>
              <SheetFooter className="mt-1.5">
                <Link
                  href="/checkout"
                  aria-label="Proceed to checkout"
                  className={cn(buttonVariants({ size: "sm" }), "w-full")}
                >
                  Proceed to Checkout
                </Link>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-2">
            <Icons.cart
              className="h-12 w-12 text-muted-foreground"
              aria-hidden
            />
            <span className="text-lg font-medium text-muted-foreground">
              Your cart is empty
            </span>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
