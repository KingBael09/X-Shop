import { Fragment } from "react"
import Link from "next/link"
import { Icons } from "@/util/icons"

import { cn } from "@/lib/utils"

export interface BreadSegment {
  title: string
  href: string
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  segments: BreadSegment[]
  separator?: React.ComponentType<{ className?: string }>
}

/**
 * Note that this is a server side component unlike auto-breadcrumbs
 */
export function Breadcrumbs({
  segments,
  className,
  separator,
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
