import { cn } from "@/lib/utils"

import { Icons } from "./util/icons"

type ImagePlaceHolderProps = React.HtmlHTMLAttributes<HTMLDivElement>

export function ImagePlaceHolder({
  className,
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
        className="h-9 w-9 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  )
}
