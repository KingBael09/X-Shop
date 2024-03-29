"use client"

import { Fragment, type HtmlHTMLAttributes } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icons } from "@/util/icons"

import { cn, toTitleCase, truncate as turncateString } from "@/lib/utils"

import { BackButton } from "../back-button"

interface AutoBreadCrumbProps extends HtmlHTMLAttributes<HTMLElement> {
  separator?: React.ComponentType<{ className?: string }>
  turncate?: number
}

/**
 * Note that this is a client side component unlike breadcrumbs
 */
export function AutoBreadCrumbs({
  separator,
  className,
  turncate = 0,
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
      <BackButton className="mr-2 size-auto p-1" />
      {segments.map((segment, i) => {
        const isLastSegment = i === segments.length - 1
        return (
          <Fragment key={segment.href}>
            <Link
              aria-current={isLastSegment ? "page" : undefined}
              href={segment.href}
              className={cn(
                "truncate transition-colors hover:text-foreground",
                isLastSegment ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {turncate > 0 && segment.title
                ? turncateString(segment.title, turncate)
                : segment.title}
            </Link>
            {!isLastSegment && <SeparatorIcon className="mx-2 size-4" />}
          </Fragment>
        )
      })}
    </nav>
  )
}
