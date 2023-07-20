"use client"

import { Fragment, type HtmlHTMLAttributes } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn, toTitleCase } from "@/lib/utils"
import { Icons } from "@/components/util/icons"

interface AutoBreadCrumbProps extends HtmlHTMLAttributes<HTMLElement> {
  separator?: React.ComponentType<{ className?: string }>
}

/**
 * Note that this is a client side component unlike breadcrumbs
 */
export function AutoBreadCrumbs({
  separator,
  className,
  ...props
}: AutoBreadCrumbProps) {
  const pathName = usePathname()
  const SeparatorIcon = separator ?? Icons.chevronRight

  const segments: { title: string; href: string }[] = []

  const pathObjects = pathName.split("/").filter((e) => e.length > 0)

  pathObjects.forEach((e, i) => {
    if (!Number(e) && e.length > 0) {
      const link = pathObjects.slice(0, i + 1).join("/")
      segments.push({
        title: toTitleCase(e),
        href: `/${link}`,
      })
    }
  })

  return (
    <nav
      aria-label="breadcrumbs"
      className={cn(
        "flex items-center text-sm font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      {segments.map((segment, i) => {
        const isLastSegment = i === segments.length - 1
        return (
          <Fragment key={segment.href}>
            <Link
              aria-current={isLastSegment ? "page" : undefined}
              href={segment.href}
              className={cn(
                "truncate transition-colors hover:text-muted-foreground",
                isLastSegment
                  ? "pointer-events-none text-muted-foreground"
                  : "text-foreground"
              )}
            >
              {segment.title}
            </Link>
            {!isLastSegment && <SeparatorIcon className="mx-2 h-4 w-4" />}
          </Fragment>
        )
      })}
    </nav>
  )
}
