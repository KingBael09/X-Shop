import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function ProductNotFound() {
  return (
    <Shell className="flex-1">
      <ErrorCard
        title="Category not Found"
        description="The category you are looking for doesn't exist"
        routeName="Go Home"
        routeLink="/"
      />
    </Shell>
  )
}
