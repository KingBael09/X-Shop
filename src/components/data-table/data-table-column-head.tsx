import { Icons } from "@/util/icons"
import type { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button } from "@/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  ...rest
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn(className)} {...rest}>
        {title}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Sort column"
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <Icons.arrowDown className="ml-2 size-4" aria-hidden />
            ) : column.getIsSorted() === "asc" ? (
              <Icons.arrowUp className="ml-2 size-4" aria-hidden />
            ) : (
              <Icons.chevronUpDown className="ml-2 size-4" aria-hidden />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            aria-label="Sort ascending"
            onClick={() => column.toggleSorting(false)}
          >
            <Icons.arrowUp
              className="mr-2 size-3.5 text-muted-foreground/70"
              aria-hidden
            />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            aria-label="Sort descending"
            onClick={() => column.toggleSorting(true)}
          >
            <Icons.arrowDown
              className="mr-2 size-3.5 text-muted-foreground/70"
              aria-hidden
            />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            aria-label="Hide Column"
            onClick={() => column.toggleVisibility(false)}
          >
            <Icons.hide
              className="mr-2 size-3.5 text-muted-foreground/70"
              aria-hidden
            />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
