import Link, { type LinkProps } from "next/link"

import { cn } from "@/lib/utils"

import type { Store } from "../lib/db/schema"
import { Button, buttonVariants } from "./ui/button"
import { Icons } from "./util/icons"

interface StorePagerProps {
  current: Pick<Store, "id" | "name">
  stores: Pick<Store, "id" | "name">[]
}

interface ModLinkProps extends LinkProps {
  disabled: boolean
  children: React.ReactNode
  className?: string
}

function ModLink({ disabled, children, className, ...props }: ModLinkProps) {
  if (disabled)
    return (
      <Button variant="secondary" size="sm" disabled>
        {children}
      </Button>
    )

  return (
    <Link
      className={cn(
        buttonVariants({ variant: "secondary", size: "sm" }),
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

export default function StorePager({ current, stores }: StorePagerProps) {
  const currentIndex = stores.findIndex((store) => store.id === current.id)

  const lowerFail = 0 > currentIndex - 1
  const upperFail = currentIndex + 1 >= stores.length

  return (
    <div className="flex gap-2 pr-1">
      <ModLink
        disabled={lowerFail}
        replace
        href={`/dashboard/stores/${stores[currentIndex - 1]?.id as number}`}
      >
        <Icons.chevronLeft className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Previous store</span>
      </ModLink>
      <ModLink
        disabled={upperFail}
        replace
        href={`/dashboard/stores/${stores[currentIndex + 1]?.id as number}`}
      >
        <Icons.chevronRight className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Next store</span>
      </ModLink>
    </div>
  )
}