"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icons } from "@/util/icons"

import { cn } from "@/lib/utils"

export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  description?: string
}

interface SideBarProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  items: NavItem[]
}

export function SidebarNav({ items, className, ...props }: SideBarProps) {
  const pathname = usePathname()
  if (!items?.length) return null

  return (
    <div className={cn("flex w-full flex-col gap-2", className)} {...props}>
      {items.map((item, index) => {
        const Icon = Icons[item.icon ?? "chevronLeft"]

        return item.href ? (
          <Link
            key={index}
            href={item.href}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            <span
              className={cn(
                "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:bg-muted hover:text-foreground",
                pathname.startsWith(item.href)
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground",
                item.disabled && "pointer-events-none opacity-60"
              )}
            >
              <Icon className="mr-2 h-4 w-4" aria-hidden />
              <span>{item.title}</span>
            </span>
          </Link>
        ) : (
          <span
            key={index}
            className="flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline"
          >
            {item.title}
          </span>
        )
      })}
    </div>
  )
}

// TODO: Hey this could be used to render categories in /categories/[category]
