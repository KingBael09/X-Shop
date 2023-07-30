import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"

export default async function PurchasesPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  const allOrders = await db.query.orders.findMany({
    where: eq(orders.userId, user.id),
  })

  return <div></div>
}

// TODO: Purchases page reamining
