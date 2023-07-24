import { LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"

import { Icons } from "./util/icons"

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
        "flex h-full w-full items-center justify-center bg-secondary",
        className
      )}
      {...props}
    >
      <Icons.placeholder
        {...iconProps}
        className={cn("h-9 w-9 text-muted-foreground", iconProps?.className)}
        aria-hidden="true"
      />
    </div>
  )
}
