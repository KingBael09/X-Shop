import type { Metadata } from "next"

import { UserProfile } from "@/components/user-profile"

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your account",
}

export default function AccountPage() {
  return <UserProfile />
}
