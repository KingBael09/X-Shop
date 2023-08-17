import type { LayoutProps } from "@/types"

import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"

export default function AccountLayout({ children }: LayoutProps) {
  return (
    <Shell variant="sidebar">
      <Header
        title="Account"
        description="Manage your account settings."
        size="sm"
      />
      <div className="w-full overflow-hidden">{children}</div>
    </Shell>
  )
}
