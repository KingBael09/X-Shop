import { notFound, redirect } from "next/navigation"
import type { LayoutProps } from "@/types"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { stores } from "@/lib/db/schema"
import { BackButton } from "@/components/back-button"
import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"
import StorePager from "@/components/store-pager"
import { StoreTabs } from "@/components/store-tabs"

export interface StoreLayoutProps extends LayoutProps {
  params: {
    id: string
  }
}

export default async function StoreLayout({
  children,
  params,
}: StoreLayoutProps) {
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

  return (
    <Shell variant="sidebar" className="gap-4">
      <div className="flex items-center space-x-4">
        <BackButton />
        <Header title={store.name} size="sm" className="flex-1" />
        {allStores.length > 1 ? (
          <StorePager stores={allStores} current={store} />
        ) : null}
      </div>
      <div className="space-y-4 overflow-hidden">
        <StoreTabs className="w-full" storeId={storeId} />
        {children}
      </div>
    </Shell>
  )
}
