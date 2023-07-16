import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function ProductNotFound() {
  return (
    <Shell>
      <ErrorCard
        title="Product Not Found"
        description="The product may have expired or you may have already updated your product"
        routeLink={`/dashboard/stores`}
        routeName="Go to Stores"
      />
    </Shell>
  )
}
