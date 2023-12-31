import "@/styles/globals.css"

import type { Metadata, Viewport } from "next"
import { env } from "@/env.mjs"
import type { LayoutProps } from "@/types"
import { Analytics } from "@/util/analytics"
import { Plugins } from "@/util/plugins"
import { Providers } from "@/util/providers"
import { TailwindIndicator } from "@/util/tailwind-indicator"
import { ClerkProvider } from "@clerk/nextjs"

import { siteConfig } from "@/config/site"
import { fontMono, fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/ui/toaster"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: {
    name: siteConfig.author,
    url: siteConfig.links.github,
  },
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/opengraph-image.png`],
    creator: siteConfig.author,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
            fontMono.variable
          )}
        >
          <Providers attribute="class" defaultTheme="system" enableSystem>
            <Toaster />
            {children}
            <TailwindIndicator />
          </Providers>
          <Plugins />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}

// TODO: implement resend
// TODO: think of a way to integrate with tanstack

// TODO: Scope the ClerkProvider to Dashboard
// TODO: Make HeroImage & sigin image available locally available with blur effect

// ! IMPORTANT
// TODO: UTAPI has been depriciated in v5.7.0 and will be deleted in next major release
// Why the f is depriciated not noted in tsc or lint

// TODO: Make fallback for Table component page number param
