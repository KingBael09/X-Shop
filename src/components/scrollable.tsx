"use client"

import { useEffect, useState } from "react"
import { Icons } from "@/util/icons"

import { cn } from "@/lib/utils"

type ScrollIndicatorProps = React.HTMLAttributes<HTMLDivElement>

export function Scrollable({ className, ...props }: ScrollIndicatorProps) {
  const [scroll, setScroll] = useState(0)

  const handleScroll = () => {
    const position = window.scrollY
    setScroll(position)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isScrolled = scroll > 90

  return (
    <div className={cn("hidden md:block", className)} {...props}>
      <Icons.scroll
        className={cn(
          "size-10 animate-fade-out opacity-0",
          !isScrolled ? "block" : "hidden"
        )}
        style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
      />
    </div>
  )
}
