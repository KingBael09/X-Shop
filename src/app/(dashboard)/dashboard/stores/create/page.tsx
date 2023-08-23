import type { Metadata } from "next"
import { AddStoreForm } from "@/forms/add-store-form"

export const metadata: Metadata = {
  title: "Create Store",
  description: "Create a new store",
}

export default function CreateStorePage() {
  return <AddStoreForm />
}
