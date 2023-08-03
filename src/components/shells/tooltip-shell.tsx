import type { LayoutProps } from "@/types"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip"

interface TooltipButtonProps extends LayoutProps {
  tooltip: string
}

export function TooltipContainer({ children, tooltip }: TooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
