import type { LayoutProps } from "@/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"
import { Header } from "@/components/header"

export default function CreateStorePageLayout({ children }: LayoutProps) {
  return (
    <>
      <Header
        title="Create Store"
        description="Create new store for your account."
        size="sm"
      />
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Add store</CardTitle>
          <CardDescription>Fill in the details to create store</CardDescription>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>
    </>
  )
}
