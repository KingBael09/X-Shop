"use client"

import { useRouter, useSearchParams } from "next/navigation"

import type { Store } from "../lib/db/schema"
import { Button } from "./ui/button"
import { Icons } from "./util/icons"

interface StorePagerProps {
  current: Pick<Store, "id" | "name">
  stores: Pick<Store, "id" | "name">[]
}

export default function StorePager({ current, stores }: StorePagerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const param = searchParams.get("table") ?? "store"

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
