import "@/styles/globals.css"

import type { Metadata } from "next"
import { Providers } from "@/util/providers"
import { TailwindIndicator } from "@/util/tailwind-indicator"
import { ClerkProvider } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/react"

import { siteConfig } from "@/config/site"
import { fontMono, fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/ui/toaster"

export const metadata: Metadata = {
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
    images: [`${siteConfig.url}/og.jpg`],
    creator: siteConfig.author,
  },
  icons: {
    icon: "/favicon.ico",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
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

// TODO: Mobile nav remaining
// TODO: implement resend
// TODO: think of a way to integrate with tans

// FIXME: Change -> package.json now has sideEffects:false -> this reduces firstload js by 21kbs : Check if that is causing problems any where
