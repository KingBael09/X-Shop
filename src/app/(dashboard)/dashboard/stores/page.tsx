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
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import { Separator } from "@/ui/separator"
import { Header } from "@/components/header"
import { StoreCard } from "@/components/store-card"

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
    <>
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
        {userStores.map(({ id, description, name }) => (
          <StoreCard
            store={{
              id,
              description,
              name,
            }}
            key={id}
            link={`/dashboard/stores/${id}`}
          />
        ))}
      </div>
    </>
  )
}
