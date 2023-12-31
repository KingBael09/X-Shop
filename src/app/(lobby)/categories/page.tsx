import Link from "next/link"

import { getCachedCategoriesAction } from "@/lib/helpers/categories"
import { toTitleCase } from "@/lib/utils"
import { Card, CardDescription, CardHeader, CardTitle } from "@/ui/card"
import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"

export default async function AllCategoriesPage() {
  const allCategories = await getCachedCategoriesAction()

  return (
    <div className="absolute inset-0 z-10 bg-background">
      <Shell className="">
        <Header
          title="All Categories"
          description="Pick your desired category"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {allCategories.map((category) => (
            <Card asChild key={category.id} className="hover:bg-accent">
              <Link href={`/categories/${category.name}`}>
                <CardHeader>
                  <CardTitle>{toTitleCase(category.name)}</CardTitle>
                  <CardDescription className="line-clamp-1 flex gap-1 text-ellipsis">
                    {category.subcategories?.map((s, i) => (
                      <span key={s}>
                        {s}
                        {Number(category.subcategories?.length) - 1 !== i &&
                          ","}
                      </span>
                    ))}
                  </CardDescription>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>
      </Shell>
    </div>
  )
}

// TODO: Maybe pagination in future

// TODO: Similarly make page for stores and store/[storeId]
// TODO: if categories/* , stores/* are similary to products/* then there must be a way to redirect maybe and not have to rewrite logic -> maybe sort of like mode
