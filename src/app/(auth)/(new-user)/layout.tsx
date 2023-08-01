import { redirect } from "next/navigation"
import type { LayoutProps } from "@/types"
import { auth } from "@clerk/nextjs"

import { Shell } from "@/components/shells/shell"

export default function NewUserLayout({ children }: LayoutProps) {
  const { userId } = auth()
  // redirect to home page if user is logged in
  if (userId) redirect("/")

  return <Shell className="max-w-lg">{children}</Shell>
}
