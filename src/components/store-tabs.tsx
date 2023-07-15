"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"

interface StoreTabsProps extends React.ComponentPropsWithoutRef<typeof Tabs> {
  storeId: number
}

export function StoreTabs({ storeId, className, ...props }: StoreTabsProps) {
  const pathname = usePathname()
  const tabs = [
    {
      title: "Store",
      href: `/dashboard/stores/${storeId}`,
    },
    {
      title: "Products",
      href: `/dashboard/stores/${storeId}/products`,
    },
    {
      title: "Orders",
      href: `/dashboard/stores/${storeId}/orders`,
    },
    {
      title: "Payments",
      href: `/dashboard/stores/${storeId}/payments`,
    },
  ]

  return (
    <Tabs
      {...props}
      className={cn("w-full overflow-x-auto", className)}
      defaultValue={pathname}
    >
      <TabsList className="w-full">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.title} value={tab.href} asChild>
            <Link className="px-4" replace href={tab.href}>
              {tab.title}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
