import type { LayoutProps } from "@/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"
import { BackButton } from "@/components/back-button"
import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"

export default function CreateStorePageLayout({ children }: LayoutProps) {
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
        <CardContent>{children}</CardContent>
      </Card>
    </Shell>
  )
}
