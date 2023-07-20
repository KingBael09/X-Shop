"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button, buttonVariants } from "@/ui/button"
import { Skeleton } from "@/ui/skeleton"
import { SignOutButton } from "@clerk/nextjs"

import { cn } from "@/lib/utils"
import { useMounted } from "@/hooks/use-mounted"
import { Icons } from "@/components/util/icons"

export function LogOutButtons() {
  const router = useRouter()
  const mounted = useMounted()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex w-full items-center space-x-2">
      {mounted ? (
        <SignOutButton
          signOutCallback={() =>
            startTransition(() => {
              router.push(`${window.location.origin}/?redirect=false`)
            })
          }
        >
          <Button
            aria-label="Log out"
            size="sm"
            className="w-full"
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Log out
          </Button>
        </SignOutButton>
      ) : (
        <Skeleton
          className={cn(
            buttonVariants({ size: "sm" }),
            "w-full bg-muted text-muted-foreground"
          )}
        >
          Log out
        </Skeleton>
      )}
      <Button
        aria-label="Go back to the previous page"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => router.back()}
        disabled={isPending}
      >
        Go back
      </Button>
    </div>
  )
}
