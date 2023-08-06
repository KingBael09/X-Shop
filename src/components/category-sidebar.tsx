"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

import type { Category } from "@/lib/db/schema"
import { cn, toTitleCase } from "@/lib/utils"
import { useOnClickOutside } from "@/hooks/use-onclick-outside"
import { buttonVariants } from "@/ui/button"
import { Input } from "@/ui/input"

interface CategorySideBarProps {
  categories: Category[]
}

export function CategorySideBar({ categories }: CategorySideBarProps) {
  const [query, setQuery] = useState("")
  const segment = useSelectedLayoutSegment()
  const ref = useRef<HTMLInputElement>(null)

  useOnClickOutside(ref, () => setQuery(""))

  return (
    <div className="relative h-full space-y-3">
      <Input
        ref={ref}
        value={query}
        className="sticky top-0"
        placeholder="Search category"
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="flex flex-col gap-2">
        {categories
          .filter((c) => c.name.includes(query))
          .map((category) => (
            <Link
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "block",
                category.name === segment &&
                  "bg-accent/80 text-accent-foreground"
              )}
              href={`/categories/${category.name}`}
              key={category.id}
            >
              {toTitleCase(category.name)}
            </Link>
          ))}
      </div>
    </div>
  )
}
