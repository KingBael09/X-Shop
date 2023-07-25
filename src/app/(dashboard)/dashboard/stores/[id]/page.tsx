import { notFound } from "next/navigation"
import { UpdateStoreForm } from "@/forms/update-store-form"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { stores } from "@/lib/db/schema"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"

interface StorePageProps {
  params: {
    id: string
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const storeId = Number(params.id)

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    columns: {
      id: true,
      name: true,
      description: true,
    },
  })

  if (!store) notFound()

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Update your store</CardTitle>
        <CardDescription>
          Update your store name and description, or delete it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateStoreForm store={store} />
      </CardContent>
    </Card>
  )
}
