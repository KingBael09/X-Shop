import type { LayoutProps } from "@/types"

import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"

interface LobbyLayoutProps extends LayoutProps {
  preview: React.ReactNode
}

export default function LobbyLayout({ children, preview }: LobbyLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      {preview}
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </div>
  )
}

// TODO: Implement base pages with https://nextjs.org/docs/app/api-reference/next-config-js/mdxRs or with ContentLayer
