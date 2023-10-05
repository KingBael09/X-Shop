import Link from "next/link"
import { Icons } from "@/util/icons"
import type { User } from "@clerk/nextjs/server"

import { mainNav } from "@/config/site"
import { Button, buttonVariants } from "@/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu"

import { CartSheet } from "../cart/cart-sheet"
import { ComboBox } from "../combo-box"
import { MainNav } from "../navbar/main-nav"
import { MobileNav } from "../navbar/mobile/mobile-nav"
import UserAvatar from "../user-avatar"

interface SiteHeaderProps {
  user: User | null
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const email =
    user?.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? ""

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-[var(--navbar-height)] items-center">
        <MainNav items={mainNav} />
        <MobileNav items={mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ComboBox />
            <CartSheet />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <UserAvatar user={user} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  sideOffset={10}
                  className="w-56"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/account"
                        className="cursor-pointer"
                      >
                        <Icons.user className="mr-2 h-4 w-4" aria-hidden />
                        Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/stores" className="cursor-pointer">
                        <Icons.dashboard className="mr-2 h-4 w-4" aria-hidden />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild disabled>
                      <Link href="/settings" className="cursor-pointer">
                        <Icons.settings className="mr-2 h-4 w-4" aria-hidden />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/signout" className="cursor-pointer">
                      <Icons.logout className="mr-2 h-4 w-4" aria-hidden />
                      Log out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/signin">
                <div
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  Sign In
                  <span className="sr-only">Sign In</span>
                </div>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
