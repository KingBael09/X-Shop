"use server"

import { setTimeout } from "timers/promises"

interface DeleteProductionActionInterface {
  id: number
  storeId: number
}

export async function deleteProductAction({
  id,
  storeId,
}: DeleteProductionActionInterface) {
  await setTimeout(3000)
  console.log(id)
}
