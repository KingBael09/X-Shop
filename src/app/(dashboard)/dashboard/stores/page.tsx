import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { env } from "@/env.mjs"
import { Icons } from "@/util/icons"
import { auth } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { FreeTierStoreLimit } from "@/config/site"
import { db } from "@/lib/db"
import { stores } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert"
import { buttonVariants } from "@/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"
import { Separator } from "@/ui/separator"
import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Stores",
  description: "Manage your stores",
}

export default async function StoresPage() {
  const { userId } = auth()

  if (!userId) redirect("/signin")

  const userStores = await db.query.stores.findMany({
    where: eq(stores.userId, userId),
  })

  return (
    <Shell variant="sidebar">
      <Header title="Stores" description="Manage your stores" size="sm" />
      <Alert>
        <Icons.terminal className="h-4 w-4" aria-hidden />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Currently one user can create only {FreeTierStoreLimit} stores
        </AlertDescription>
      </Alert>
      <Card className="flex h-full items-center">
        <CardHeader className="flex-1">
          <CardTitle>
            {userStores.length >= FreeTierStoreLimit
              ? "Upgrade Subscription"
              : "Create a new store"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pr-6">
          <Link
            href={
              userStores.length >= FreeTierStoreLimit
                ? "/dashboard/billing"
                : "/dashboard/stores/create"
            }
            className={cn(
              buttonVariants({
                size: "sm",
                // className: "h-8 w-full",
              })
            )}
          >
            {userStores.length >= FreeTierStoreLimit
              ? "Upgrade Subscription"
              : "Create a store"}
            <span className="sr-only">
              {userStores.length >= FreeTierStoreLimit
                ? "Upgrade Subscription"
                : "Create a store"}
            </span>
          </Link>
        </CardContent>
      </Card>
      <Separator className="bg-border/50" />
      {userStores.length === 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Add stores to view here
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
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
      </div>
    </Shell>
  )
}

// TODO: I think its a good idea to add random svg to store blocks like uploadthing
