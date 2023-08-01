import type { LayoutProps } from "@/types"
import { currentUser } from "@clerk/nextjs"

import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"

export default function LobbyLayout({ children }: LayoutProps) {
  const user = currentUser()

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </div>
  )
}

// TODO: Implement base pages with https://nextjs.org/docs/app/api-reference/next-config-js/mdxRs
