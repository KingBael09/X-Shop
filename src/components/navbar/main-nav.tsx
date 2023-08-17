import Link from "next/link"
import { Icons } from "@/util/icons"

import { siteConfig } from "@/config/site"
import { NavigationMenu, NavigationMenuList } from "@/ui/navigation-menu"

export function MainNav() {
  return (
    <div className="hidden gap-6 lg:flex">
      <Link
        aria-label="Home"
        href="/"
        className="hidden items-center space-x-2 lg:flex"
      >
        <Icons.logo className="h-6 w-6" aria-hidden />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>{/* Content Here */}</NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
