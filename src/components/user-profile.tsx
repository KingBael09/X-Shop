"use client"

import { UserProfile as ClerkUserProfile } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import type { Theme } from "@clerk/types"
import { useTheme } from "next-themes"

const appearance: Theme = {
  baseTheme: undefined,
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

// TODO: Seems like there is some sort of problem in production
