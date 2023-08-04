import type { LayoutProps } from "@/types"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip"

interface TooltipShellProps extends LayoutProps {
  tooltip: string
}

export function TooltipShell({ children, tooltip }: TooltipShellProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
