import type { Metadata } from "next"
import { env } from "@/env.mjs"
import type { LayoutProps } from "@/types"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Stores",
  description: "Manage your stores",
}

export default function DashboardLayout({ children }: LayoutProps) {
  return <div>{children}</div>
}
