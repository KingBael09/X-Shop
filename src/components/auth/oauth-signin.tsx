"use client"

import { useState } from "react"
import { Icons, type AllIcons } from "@/util/icons"
import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs"
import type { OAuthStrategy } from "@clerk/types"
import { toast } from "sonner"

import { Button } from "@/ui/button"

interface OAuthProviders {
  name: string
  icon: AllIcons
  strategy: OAuthStrategy
}

const oauthProviders = [
  { name: "Google", strategy: "oauth_google", icon: "google" },
  { name: "GitHub", strategy: "oauth_github", icon: "gitHub" },
  { name: "Discord", strategy: "oauth_discord", icon: "discord" },
] satisfies OAuthProviders[]

export function OAuthSignIn() {
  const [isLoading, setIsLoading] = useState<OAuthStrategy | null>(null)
  const { signIn, isLoaded: signInLoaded } = useSignIn()

  async function oauthSignIn(provider: OAuthStrategy) {
    if (!signInLoaded) return null
    try {
      setIsLoading(provider)
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      })
    } catch (error) {
      setIsLoading(null)

      const unknownError = "Something went wrong, please try again."

      isClerkAPIResponseError(error)
        ? toast.error(error.errors[0]?.longMessage ?? unknownError)
        : toast.error(unknownError)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
      {oauthProviders.map((provider) => {
        const Icon = Icons[provider.icon]

        return (
          <Button
            aria-label={`Sign in with ${provider.name}`}
            key={provider.strategy}
            variant="outline"
            className="w-full bg-background sm:w-auto"
            onClick={() => void oauthSignIn(provider.strategy)}
            disabled={isLoading !== null}
          >
            {isLoading === provider.strategy ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" aria-hidden />
            ) : (
              <Icon className="mr-2 size-4" aria-hidden />
            )}
            {provider.name}
          </Button>
        )
      })}
    </div>
  )
}
