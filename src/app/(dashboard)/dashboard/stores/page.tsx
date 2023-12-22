import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Icons } from "@/util/icons"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { FreeTierStoreLimit } from "@/config/site"
import { db } from "@/lib/db"
import { stores } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert"
import { buttonVariants } from "@/ui/button"
import { Separator } from "@/ui/separator"
import { Header } from "@/components/header"
import { ModLink } from "@/components/mod-link"
import { StoreCard } from "@/components/store-card"

export const metadata: Metadata = {
  title: "Stores",
  description: "Manage your stores",
}

export default async function StoresPage() {
  const user = await currentUser()

  if (!user) redirect("/signin")

  const userStores = await db.query.stores.findMany({
    where: eq(stores.userId, user.id),
  })

  // TODO: Currently links are disabled when user has reached the limit of stores.

  return (
    <>
      <div className="flex items-center gap-2">
        <Header title="Stores" description="Manage your stores" size="sm" />
        <ModLink
          disabled={userStores.length >= FreeTierStoreLimit}
          href={
            userStores.length >= FreeTierStoreLimit
              ? "/dashboard/billing"
              : "/dashboard/stores/create"
          }
          className={cn(
            "ml-auto",
            buttonVariants({
              size: "sm",
            })
          )}
        >
          {userStores.length >= FreeTierStoreLimit
            ? "Upgrade Subscription"
            : "Create a store"}
        </ModLink>
      </div>
      <Alert>
        <Icons.terminal className="size-4" aria-hidden />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Currently one user can create only {FreeTierStoreLimit} stores
        </AlertDescription>
      </Alert>
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
