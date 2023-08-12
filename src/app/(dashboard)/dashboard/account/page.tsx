import type { Metadata } from "next"
import { env } from "@/env.mjs"

import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"
import { UserProfile } from "@/components/user-profile"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Account",
  description: "Manage your account",
}

export default function AccountPage() {
  return (
    <Shell variant="sidebar">
      <Header
        title="Account"
        description="Manage your account settings."
        size="sm"
      />
      <div className="w-full overflow-hidden">
        <UserProfile />
      </div>
    </Shell>
  )
}

// TODO: If i don't have a nested layout then loading and page's shell and header should be moved to layout -> check if other places can have these optimization
