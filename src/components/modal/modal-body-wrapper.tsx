"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { Icons } from "@/util/icons"

import { cn } from "@/lib/utils"
import { useLockBody } from "@/hooks/use-lock-body"
import { useOnClickOutside } from "@/hooks/use-onclick-outside"
import { Button } from "@/ui/button"
import { ScrollArea } from "@/ui/scroll-area"

interface ModalBodyWrapper
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: string | React.ReactNode
}

export function ModalBodyWrapper({
  title,
  children,
  className,
  ...props
}: ModalBodyWrapper) {
  const router = useRouter()

  const ref = useRef<HTMLDivElement>(null)

  useLockBody()
  useOnClickOutside(ref, () => router.back())

  // TODO: Think of a way to debounce or limit click outside event so that in case of slow transition i don't go back more the one

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-fit w-full flex-col gap-4 rounded-lg bg-background",
        className
      )}
      {...props}
    >
      <div className="flex justify-between p-4">
        {title && <div className="flex-1">{title}</div>}
        <Button
          variant="ghost"
          className="ml-auto h-6 w-6 rounded-md p-0"
          onClick={() => router.back()}
        >
          <Icons.close aria-label="close modal" className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="max-h-[80vh] overflow-y-auto pb-4 pl-4 [scrollbar-gutter:stable]">
        {children}
      </ScrollArea>
    </div>
  )
}
