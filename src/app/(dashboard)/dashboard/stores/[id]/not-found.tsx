import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shell"

export default function StoreNotFound() {
  return (
    <Shell variant="centered">
      <ErrorCard
        title="Store not found"
        description="The store may have expired or you may have already updated your store"
        routeLink="/dashboard/stores"
        routeName="Go to Stores"
      />
    </Shell>
  )
}
