import type { LayoutProps } from "@/types"

import { getAllCategoriesAction } from "@/lib/actions/category"
import { ScrollArea } from "@/ui/scroll-area"
import { CategorySideBar } from "@/components/category-sidebar"
import { AutoBreadCrumbs } from "@/components/pagers/auto-breadcrumbs"

export default async function CategoriesLayout({ children }: LayoutProps) {
  const allCategories = await getAllCategoriesAction()

  return (
    <div className="container relative flex min-h-[calc(var(--navbar-page-offset))] gap-6">
      <aside className="sticky top-[calc(var(--navbar-height)_+_1px)] mr-2 hidden max-h-[calc(var(--navbar-page-offset))] flex-[0.2] border-r border-accent pr-1 md:flex">
        <ScrollArea className="w-full py-6 pr-3">
          <CategorySideBar categories={allCategories} />
        </ScrollArea>
      </aside>
      <div className="flex min-h-[calc(var(--navbar-page-offset))] flex-1 flex-col">
        <AutoBreadCrumbs className="mt-6 md:mt-8" />
        {children}
      </div>
    </div>
  )
}

// TODO: Maybe infinite scrolling in future (for categories)
