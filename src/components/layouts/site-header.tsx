import { Suspense } from "react"

import { mainNav } from "@/config/site"
import { Skeleton } from "@/ui/skeleton"

import { CartSheet } from "../cart/cart-sheet"
import { ComboBox } from "../combo-box"
import { MainNav } from "../navbar/main-nav"
import { MobileNav } from "../navbar/mobile/mobile-nav"
import { UserButton } from "../user-button"

function UserButtonFallback() {
  return (
    <div className="relative flex size-10 shrink-0 overflow-hidden rounded-full">
      <Skeleton className="absolute inset-0" />
    </div>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-[var(--navbar-height)] items-center">
        <MainNav items={mainNav} />
        <MobileNav items={mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ComboBox />
            <CartSheet />
            <Suspense fallback={<UserButtonFallback />}>
              <UserButton />
            </Suspense>
          </nav>
        </div>
      </div>
    </header>
  )
}
