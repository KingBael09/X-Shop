import { notFound, redirect } from "next/navigation"
import type { LayoutProps } from "@/types"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { stores } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"
import StorePager from "@/components/store-pager"

interface StoreLayoutProps extends LayoutProps {
  params: {
    id: string
  }
  orders: React.ReactNode
  payments: React.ReactNode
  products: React.ReactNode
}

export default async function StoreLayout(props: StoreLayoutProps) {
  const { params } = props

  const storeId = Number(params.id)

  const user = await currentUser()

  if (!user) redirect("/signin")

  const allStores = await db.query.stores.findMany({
    where: eq(stores.userId, user.id),
    columns: {
      id: true,
      name: true,
    },
  })

  const store = allStores.find((store) => store.id === storeId)

  if (!store) return notFound()

  const tabs = [
    {
      title: "Store",
      value: "children" as const,
    },
    {
      title: "Products",
      value: "products" as const,
    },
    {
      title: "Orders",
      value: "orders" as const,
    },
    {
      title: "Payments",
      value: "payments" as const,
    },
  ]

  return (
    <Shell variant="sidebar" className="gap-4">
      <div className="flex items-center space-x-4">
        <Header title={store.name} size="sm" className="flex-1" />
        {allStores.length > 1 ? (
          <StorePager stores={allStores} current={store} />
        ) : null}
      </div>
      <div className="overflow-x-hidden">
        <Tabs className="w-full" defaultValue="children">
          <TabsList className="w-full">
            {tabs.map((tab) => (
              <TabsTrigger className="px-4" key={tab.title} value={tab.value}>
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.title} value={tab.value}>
              {props[tab.value]}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Shell>
  )
}
