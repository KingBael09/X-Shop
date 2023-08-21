import type { LayoutProps } from "@/types"

import { Header } from "@/components/header"

export default function AccountLayout({ children }: LayoutProps) {
  return (
    <>
      <Header
        title="Account"
        description="Manage your account settings."
        size="sm"
      />
      <div className="w-full overflow-hidden">{children}</div>
    </>
  )
}
