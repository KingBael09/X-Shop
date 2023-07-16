"use client"

import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function Error() {
  return (
    <Shell>
      <ErrorCard
        title="Something went wrong"
        description="Something went really wrong"
      />
    </Shell>
  )
}
