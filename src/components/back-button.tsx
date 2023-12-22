"use client"

import { useRouter } from "next/navigation"
import { Icons } from "@/util/icons"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/ui/button"

export function BackButton({ className, ...props }: ButtonProps) {
  const router = useRouter()

  return (
    <Button
      onClick={() => {
        router.back()
      }}
      aria-label="Back Button"
      className={cn(className)}
      size="icon"
      variant="ghost"
      {...props}
    >
      <Icons.chevronLeft className="size-6" />
    </Button>
  )
}
