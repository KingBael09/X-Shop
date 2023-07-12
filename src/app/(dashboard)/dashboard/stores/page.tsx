import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { FreeTierStoreLimit } from "@/config/site"
import { db } from "@/lib/db"
import { stores } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"
import { Icons } from "@/components/util/icons"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Stores",
  description: "Manage your stores",
}

export default async function StoresPage() {
  const user = await currentUser()

  if (!user) redirect("/signin")

  const userStores = await db.query.stores.findMany({
    where: eq(stores.userId, user.id),
  })

  const wtf = await db.query.stores.findMany()

  return (
    <Shell variant="sidebar">
      <Header title="Stores" description="Manage your stores" size="sm" />
      <Alert>
        <Icons.terminal className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Currently one user can create only {FreeTierStoreLimit} stores
        </AlertDescription>
      </Alert>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {userStores.length > 0}
        {userStores.map((store) => (
          <Card key={store.id} className="flex h-full flex-col">
            <CardHeader className="flex-1">
              <CardTitle className="line-clamp-1">{store.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {store.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link key={store.id} href={`/dashboard/stores/${store.id}`}>
                <div
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      className: "h-8 w-full",
                    })
                  )}
                >
                  View store
                  <span className="sr-only">View {store.name} store</span>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
        <Card className="flex h-full flex-col">
          <CardHeader className="flex-1">
            <CardTitle className="line-clamp-1">Create a new store</CardTitle>
            <CardDescription className="line-clamp-2">
              Create a new store to start selling your products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={
                userStores.length >= FreeTierStoreLimit
                  ? "/dashboard/billing"
                  : "/dashboard/stores/create"
              }
              className={cn(
                buttonVariants({
                  size: "sm",
                  className: "h-8 w-full",
                })
              )}
            >
              Create a store
              <span className="sr-only">Create a new store</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Shell>
  )
}
