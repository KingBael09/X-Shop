import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { env } from "@/env.mjs"
import type { LayoutProps } from "@/types"
import { currentUser } from "@clerk/nextjs"

import { dashboardConfig } from "@/config/dashboard"
import { ScrollArea } from "@/ui/scroll-area"
import { SidebarNav } from "@/components/layouts/nav"
import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"
import { AutoBreadCrumbs } from "@/components/pagers/auto-breadcrumbs"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Dashboard",
  description: "Manage your stores",
}

export default async function DashboardLayout({ children }: LayoutProps) {
  const user = await currentUser()

  if (!user) redirect("/signin")

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <div className="container relative flex flex-1 gap-6">
        <aside className="sticky top-[calc(var(--navbar-height)_+_1px)] mr-2 hidden max-h-[calc(var(--navbar-page-offset))] flex-[0.2] border-r border-accent pr-1 md:flex">
          <ScrollArea className="w-full py-6 pr-4">
            <SidebarNav items={dashboardConfig.sidebarNav} />
          </ScrollArea>
        </aside>
        <main className="min-h-[calc(var(--navbar-page-offset))] flex-1">
          <AutoBreadCrumbs className="mt-6 md:mt-8" />
          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}
