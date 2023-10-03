import dynamic from "next/dynamic"
import Image from "next/image"
import { Icons } from "@/util/icons"
import { currentUser } from "@clerk/nextjs"

import { getCartAction } from "@/lib/helpers/cart"
import { cn, formatPrice } from "@/lib/utils"
import { ScrollArea } from "@/ui/scroll-area"
import { Separator } from "@/ui/separator"
import { SheetFooter, SheetHeader, SheetLink, SheetTitle } from "@/ui/sheet"

import { ImagePlaceHolder } from "../no-image"
import { buttonVariants } from "../ui/button"
import { UpdateCart } from "./update-cart"

const CartSheetWrapper = dynamic(() => import("./cart-sheet-wrapper"))
// IDK Some sort of magic lets nexjts render button of cart which is inside the Warpper but not the whole sheet

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
    <CartSheetWrapper count={count}>
      <SheetHeader className="pr-6">
        <SheetTitle>Cart {count > 0 && `(${count})`}</SheetTitle>
        <Separator />
      </SheetHeader>
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
                          {/* <span>
                            {formatPrice(
                              (
                                Number(item.price) * Number(item.quantity)
                              ).toFixed(2)
                            )}
                            // TODO : Rethink layout especially price part
                          </span> */}
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
          </div>
          <SheetFooter className="mt-1.5 pr-6">
            <SheetLink
              href="/checkout"
              aria-label="Proceed to checkout"
              className={cn(buttonVariants({ size: "sm" }), "w-full")}
            >
              Proceed to Checkout
            </SheetLink>
          </SheetFooter>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center space-y-2">
          <Icons.cart className="h-12 w-12 text-muted-foreground" aria-hidden />
          <span className="text-lg font-medium text-muted-foreground">
            Your cart is empty
          </span>
        </div>
      )}
    </CartSheetWrapper>
  )
}

// TODO: There seem to be a bug when dynamically importing a named component (client-component) into server component
// https://github.com/vercel/next.js/issues/54138

// TODO: Is there no way to not send a component say...mobile nav to client if the device isn't a mobile
