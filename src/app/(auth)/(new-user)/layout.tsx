import { redirect } from "next/navigation"
import type { LayoutProps } from "@/types"
import { currentUser } from "@clerk/nextjs"

import { Shell } from "@/components/shells/shell"

export default async function NewUserLayout({ children }: LayoutProps) {
  const user = await currentUser()
  // redirect to home page if user is logged in
  if (user) redirect("/")
  return <Shell className="max-w-lg">{children}</Shell>
}
