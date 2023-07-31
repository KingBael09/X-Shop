import type { Metadata } from "next"
import { env } from "@/env.mjs"
import { AddStoreForm } from "@/forms/add-store-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Create Store",
  description: "Create a new store",
}

export default function CreateStorePage() {
  // TODO: This should mostly work because middleware will not allow to visit the page
  return <AddStoreForm />
}
