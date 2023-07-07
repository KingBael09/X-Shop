import type { LayoutProps } from "@/types"

export default function LobbyLayout({ children }: LayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* <SiteHeader user={user} /> */}
      <main className="flex-1">{children}</main>
      {/* <SiteFooter /> */}
    </div>
  )
}
