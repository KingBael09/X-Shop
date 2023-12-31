import type { FancyOmit } from "@/types/util"
import { cn } from "@/lib/utils"

interface HeaderProps
  extends FancyOmit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: string | React.ReactNode
  description?: string | null
  size?: "default" | "sm"
}

export function Header({
  title,
  description,
  size = "default",
  className,
  ...props
}: HeaderProps) {
  return (
    <div className={cn("grid gap-1", className)} {...props}>
      <h1
        className={cn(
          "line-clamp-1 text-3xl font-bold tracking-tight",
          size === "default" && "md:text-4xl"
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            "line-clamp-2 text-muted-foreground",
            size === "default" && "text-lg"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}

// TODO: Implement variants with the help of cva -> page header skateshop
