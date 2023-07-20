import type { Metadata } from "next"
import { env } from "@/env.mjs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"

import { BackButton } from "@/components/back-button"
import { AddStoreForm } from "@/components/forms/add-store-form"
import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Create Store",
  description: "Create a new store",
}

export default function CreateStorePage() {
  // TODO: This should mostly work because middleware will not allow to visit the page
  return (
    <Shell variant="sidebar">
      <div className="flex items-center gap-4">
        <BackButton />
        <Header
          title="Create Store"
          description="Create new store for your account."
          size="sm"
        />
      </div>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Add store</CardTitle>
          <CardDescription>Add a new store to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <AddStoreForm />
        </CardContent>
      </Card>
    </Shell>
  )
}
