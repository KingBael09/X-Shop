import "@/styles/globals.css"

import type { Metadata } from "next"
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
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

export const dynamic = "force-dynamic"
// TODO: !!! Current workaround for building until i narrow down headers issue
// https://clerk.com/docs/quickstarts/nextjs ClerkProvider needs access to headers

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
            <Plugins />
            {children}
            <TailwindIndicator />
          </Providers>
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}

// TODO: implement resend
// TODO: think of a way to integrate with tanstack
