import { Icons } from "@/util/icons"
import type { LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"

interface ImagePlaceHolderProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  iconProps?: LucideProps
}

export function ImagePlaceHolder({
  className,
  iconProps,
  ...props
}: ImagePlaceHolderProps) {
  return (
    <div
      aria-label="Placeholder"
      role="img"
      aria-roledescription="placeholder"
      className={cn(
        "flex size-full items-center justify-center bg-secondary",
        className
      )}
      {...props}
    >
      <Icons.placeholder
        {...iconProps}
        className={cn("size-9 text-muted-foreground", iconProps?.className)}
        aria-hidden="true"
      />
    </div>
  )
}
