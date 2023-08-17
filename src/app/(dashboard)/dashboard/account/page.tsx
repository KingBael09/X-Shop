import type { Metadata } from "next"
import { env } from "@/env.mjs"

import { UserProfile } from "@/components/user-profile"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Account",
  description: "Manage your account",
}

export default function AccountPage() {
  return <UserProfile />
}
