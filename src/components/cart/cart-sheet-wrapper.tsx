import type { LayoutProps } from "@/types"
import { Icons } from "@/util/icons"

import { Badge } from "@/ui/badge"
import { Button } from "@/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/ui/sheet"

interface CartSheetWrapperProps extends LayoutProps {
  count: number
}

/**
 * This is a custom cart-sheet wrapper which controllable state
 */
export function CartSheetWrapper({ count, children }: CartSheetWrapperProps) {
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
              className="absolute -right-2 -top-2 size-6 rounded-full p-2"
            >
              {count}
            </Badge>
          )}
          <Icons.cart className="size-4" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        {children}
      </SheetContent>
    </Sheet>
  )
}

// TODO: Seems like there is a slight issue with scrolling
