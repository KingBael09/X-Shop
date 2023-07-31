import type { LayoutProps } from "@/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"

export default function CreateProductPageLayout({ children }: LayoutProps) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add product</CardTitle>
        <CardDescription>Add a new product to your store</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
