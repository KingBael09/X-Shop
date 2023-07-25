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
      className={cn(className)}
      variant="ghost"
      size="icon"
      {...props}
    >
      <Icons.chevronLeft className="h-6 w-6" />
    </Button>
  )
}
