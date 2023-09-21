import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

// export const dynamic = "force-static"

export default function NotFound() {
  return (
    <Shell as="div">
      <ErrorCard
        title="Page Not Found"
        description="The page you are looking for doesn't exist"
        routeLink="/"
        routeName="Go Home"
      />
    </Shell>
  )
}
