import type { LayoutProps } from "@/types"

import { Shell } from "@/components/shells/shell"

export default function ProductPageLayout({ children }: LayoutProps) {
  return <Shell>{children}</Shell>
}
