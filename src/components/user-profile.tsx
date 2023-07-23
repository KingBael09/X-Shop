"use client"

import { UserProfile as ClerkUserProfile } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import type { BaseThemeTaggedType, Theme } from "@clerk/types"
import { useTheme } from "next-themes"

const appearance: Theme = {
  elements: {
    card: "shadow-none w-full m-0",
    navbar: "hidden",
    navbarMobileMenuRow: "hidden",
    header: "hidden",
    rootBox: "w-full",
    pageScrollBox: "p-0 md:py-4",
  },
}

export function UserProfile() {
  const { theme } = useTheme()

  return (
    <ClerkUserProfile
      appearance={{
        ...appearance,
        baseTheme: theme === "dark" ? dark : appearance.baseTheme,
        variables: {
          colorBackground: "transparent",
        },
      }}
    />
  )
}

{
  /*
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
  }} */
}
