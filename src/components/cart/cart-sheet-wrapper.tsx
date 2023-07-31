"use client"

import { useState } from "react"
import Link from "next/link"
import type { LayoutProps } from "@/types"
import { Icons } from "@/util/icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/ui/badge"
import { Button, buttonVariants } from "@/ui/button"
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from "@/ui/sheet"

interface CartSheetWrapperProps extends LayoutProps {
  count: number
}

/**
 * This is a custom cart-sheet wrapper which controllable state
 */
export function CartSheetWrapper({ count, children }: CartSheetWrapperProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
        {children}
        {count > 0 && (
          <SheetFooter className="mt-1.5 pr-6">
            <Link
              onClick={() => setOpen(false)}
              href="/checkout"
              aria-label="Proceed to checkout"
              className={cn(buttonVariants({ size: "sm" }), "w-full")}
            >
              Proceed to Checkout
            </Link>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

// TODO: Seems like there is a slight issue with scrolling
