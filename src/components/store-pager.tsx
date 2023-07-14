"use client"

import Link, { LinkProps } from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"

import type { Store } from "../lib/db/schema"
import { Button, buttonVariants } from "./ui/button"
import { Icons } from "./util/icons"

interface StorePagerProps {
  current: Pick<Store, "id" | "name">
  stores: Pick<Store, "id" | "name">[]
}

export default function StorePager({ current, stores }: StorePagerProps) {
  const router = useRouter()

  const currentIndex = stores.findIndex((store) => store.id === current.id)

  const lowerFail = 0 > currentIndex - 1
  const upperFail = currentIndex + 1 >= stores.length

  function handleIncrease() {
    router.replace(`/dashboard/stores/${stores[currentIndex + 1]!.id}`)
  }
  function handleDecrease() {
    router.replace(`/dashboard/stores/${stores[currentIndex - 1]!.id}`)
  }

  return (
    <div className="flex gap-2 pr-1">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleDecrease}
        disabled={lowerFail}
      >
        <Icons.chevronLeft className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Previous store</span>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleIncrease}
        disabled={upperFail}
      >
        <Icons.chevronRight className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Next store</span>
      </Button>
    </div>
  )
}

// TODO: Maybe just maybe I could make do with Link and make this server side but gotta work with disabled
