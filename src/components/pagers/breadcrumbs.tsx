import { Fragment } from "react"
import Link from "next/link"
import { Icons } from "@/util/icons"

import { cn, truncate as turncateString } from "@/lib/utils"

import { BackButton } from "../back-button"

export interface BreadSegment {
  title: string
  href: string
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  segments: BreadSegment[]
  separator?: React.ComponentType<{ className?: string }>
  turncate?: number
}

/**
 * Note that this is a server side component unlike auto-breadcrumbs
 */
export function Breadcrumbs({
  segments,
  className,
  separator,
  turncate = 0,
  ...props
}: BreadcrumbProps) {
  const SeparatorIcon = separator ?? Icons.chevronRight

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
