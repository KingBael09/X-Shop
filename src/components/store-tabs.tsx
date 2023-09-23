"use client"

import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

import { cn } from "@/lib/utils"
import { Separator } from "@/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs"

interface StoreTabsProps extends React.ComponentPropsWithoutRef<typeof Tabs> {
  storeId: number
}

export function StoreTabs({ storeId, className, ...props }: StoreTabsProps) {
  const segment = useSelectedLayoutSegment()

  const tabs = [
    {
      title: "Store",
      href: `/dashboard/stores/${storeId}`,
      slug: "",
    },
    {
      title: "Products",
      href: `/dashboard/stores/${storeId}/products`,
      slug: "products",
    },
    {
      title: "Orders",
      href: `/dashboard/stores/${storeId}/orders`,
      slug: "orders",
    },
    {
      title: "Payments",
      href: `/dashboard/stores/${storeId}/payments`,
      slug: "payments",
    },
  ]

  return (
    <Tabs
      {...props}
      className={cn("w-full overflow-x-auto ", className)}
      defaultValue={segment ?? ""}
    >
      <TabsList className="h-auto w-full justify-normal bg-background p-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.title}
            className={cn(
              "rounded-none border-b-2 border-transparent py-3 hover:text-primary",
              tab.slug === (segment ?? "") && "border-foreground"
            )}
            value={tab.slug}
            asChild
          >
            <Link
              replace
              className="px-4"
              aria-label={`${tab.title} Tab`}
              href={tab.href}
            >
              {tab.title}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
      <Separator />
    </Tabs>
  )
}

// TODO: Check unlighthouse usage example in skateshop
