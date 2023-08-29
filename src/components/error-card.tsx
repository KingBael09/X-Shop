"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Icons, type AllIcons } from "@/util/icons"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card"

interface ErrorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: AllIcons
  title: string
  description: string
  routeLink?: string
  routeName?: string
  fullscreen?: boolean
}

export function ErrorCard({
  icon,
  title,
  description,
  className,
  routeLink,
  routeName,
  fullscreen = true,
  ...props
}: ErrorCardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === "/"
  const Icon = Icons[icon ?? "warning"]
  return (
    <Card
      className={cn(
        "grid place-items-center",
        fullscreen ? "border-none" : null,
        className
      )}
      {...props}
    >
      <CardHeader>
        <div className="grid place-items-center rounded-full bg-muted">
          <Icon className="h-10 w-10" aria-hidden />
        </div>
      </CardHeader>
      <CardContent className="grid place-items-center space-y-3">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      {routeLink && routeName ? (
        <CardFooter className="gap-4">
          {!isHome && (
            <Button
              onClick={() => {
                router.back()
                // router.refresh()
              }}
            >
              <Icons.chevronLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <Link
            className={buttonVariants({ variant: "secondary" })}
            href={routeLink}
          >
            {routeName}
            <span className="sr-only">{routeName}</span>
          </Link>
        </CardFooter>
      ) : null}
    </Card>
  )
}
