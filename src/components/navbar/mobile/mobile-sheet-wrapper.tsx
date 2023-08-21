"use client"

import { useState } from "react"
import Link from "next/link"
import type { LayoutProps } from "@/types"
import { Icons } from "@/util/icons"

import { siteConfig } from "@/config/site"
import { Button } from "@/ui/button"
import { ScrollArea } from "@/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/ui/sheet"

export default function MobileSheetWrapper({ children }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Icons.menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pl-1 pr-0">
        <div className="px-7">
          <Link
            aria-label="Home"
            href="/"
            className="flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <Icons.logo className="mr-2 h-4 w-4" aria-hidden />
            <span className="font-bold">{siteConfig.name}</span>
          </Link>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="pl-1 pr-7">{children}</div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}