import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function ProductNotFound() {
  return (
    <Shell className="flex-1">
      <ErrorCard
        title="Product not Found"
        description="The product you are looking for doesn't exist"
        routeName="Go Home"
        routeLink="/"
      />
    </Shell>
  )
}
