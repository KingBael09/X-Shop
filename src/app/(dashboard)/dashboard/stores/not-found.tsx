import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function StoreNotFound() {
  return (
    <Shell>
      <ErrorCard
        title="Store not found"
        description="The store may have expired or you may have already updated your store"
        routeLink="/dashboard/stores"
        routeName="Go to Stores"
      />
    </Shell>
  )
}
