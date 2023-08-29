import type { Route } from "next"
import Link, { type LinkProps } from "next/link"
import type { VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/ui/button"

interface ModLinkProps
  extends LinkProps<Route>,
    VariantProps<typeof buttonVariants> {
  disabled: boolean
  children: React.ReactNode
  className?: string
}
/**
 * This is a Mod of `next/link` component that can be disabled!
 * @summary None of the prop except classNames, variant & size are passed to the disabled button
 */
export function ModLink({
  disabled,
  children,
  className,
  variant = "secondary",
  size = "sm",
  ...props
}: ModLinkProps) {
  if (disabled)
    return (
      <Button variant={variant} size={size} className={className} disabled>
        {children}
      </Button>
    )

  return (
    <Link
      className={cn(
        buttonVariants({ variant: variant, size: size }),
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
