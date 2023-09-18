import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"

export default function PurchasesPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/signin")
  }

  // const allOrders = await db.query.orders.findMany({
  //   where: eq(orders.userId, userId),
  // })

  return <div></div>
}

// TODO: Purchases page remaining
