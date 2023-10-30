"use client"

import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function Error() {
  return (
    <Shell className="min-h-screen">
      <ErrorCard title="Oops!" description="Something went wrong" />
    </Shell>
  )
}
