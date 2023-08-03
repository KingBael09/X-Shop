import type { LayoutProps } from "@/types"

import { toTitleCase } from "@/lib/utils"
import { Header } from "@/components/header"

interface CategoryPageProps extends LayoutProps {
  params: {
    category: string
  }
}

export default function CategoryPageLayout({
  params,
  children,
}: CategoryPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-8 px-0 py-8">
      <Header
        title="Products"
        description={`See all products in ${toTitleCase(params.category)}`}
        size="sm"
      />
      {children}
    </div>
  )
}
