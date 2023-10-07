import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import type { LayoutProps } from "@/types"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { stores } from "@/lib/db/schema"
import { Header } from "@/components/header"
import { StoreSwitcher } from "@/components/pagers/store-switcher"
import { StoreTabs } from "@/components/store-tabs"

interface PageParams {
  params: {
    id: string
  }
}

export type StoreLayoutProps = LayoutProps & PageParams

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const storeId = Number(params.id)
  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  })

  const metadata: Metadata = {
    title: {
      default: store?.name ?? "Your Store",
      template: `%s | ${store?.name ?? "Your Store"}`,
    },
    description: `${store?.name ?? "Your Store"}${
      store?.description ? ` - ${store.description}` : ""
    }`,
  }

  return metadata
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
    <>
      <div className="flex items-center space-x-4">
        <Header
          title="Dashboard"
          description={`Manage ${store.name}`}
          size="sm"
          className="flex-1"
        />
        {allStores.length > 1 && (
          <StoreSwitcher stores={allStores} current={store} />
        )}
      </div>
      <div className="space-y-8 overflow-hidden">
        <StoreTabs className="w-full" storeId={storeId} />
        {children}
      </div>
    </>
  )
}
