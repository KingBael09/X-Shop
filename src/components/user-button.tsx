import Link from "next/link"
import { Icons } from "@/util/icons"
import { currentUser } from "@clerk/nextjs"

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

import UserAvatar from "./user-avatar"

export async function UserButton() {
  const user = await currentUser()

  if (!user) {
    return (
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
    )
  }

  const email =
    user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? ""

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="relative size-8 rounded-full">
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
            <Link href="/dashboard/account" className="cursor-pointer">
              <Icons.user className="mr-2 size-4" aria-hidden />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/stores" className="cursor-pointer">
              <Icons.dashboard className="mr-2 size-4" aria-hidden />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild disabled>
            <Link href="/settings" className="cursor-pointer">
              <Icons.settings className="mr-2 size-4" aria-hidden />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/signout" className="cursor-pointer">
            <Icons.logout className="mr-2 size-4" aria-hidden />
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
