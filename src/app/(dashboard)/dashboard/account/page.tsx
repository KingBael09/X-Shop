import type { Metadata } from "next"

import "./custom.css"

import { env } from "@/env.mjs"
import { UserProfile } from "@clerk/nextjs"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Account",
  description: "Manage your account",
}

export default function AccountPage() {
  return (
    <div className="py-2 text-primary ">
      <UserProfile
        path="/dashboard/account"
        routing="path"
        appearance={{
          variables: {
            borderRadius: "0.25rem",
          },
          elements: {
            card: "shadow-none bg-transparent w-full",
            navbar: "hidden",
            navbarMobileMenuButton: "hidden",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            profileSectionPrimaryButton: "hover:bg-muted text-primary",
            badge: "bg-muted !text-primary",
            accordionTriggerButton: "focus:shadow-none !text-primary",
            profileSectionTitleText: "!text-primary",
            userPreviewTextContainer: "!text-primary",
            rootBox: "w-full",
          },
        }}
      />
    </div>
  )
}
