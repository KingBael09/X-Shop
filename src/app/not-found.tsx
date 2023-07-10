import { Shell } from "@/components/shell"

import { ErrorCard } from "../components/error-card"

export default function NotFound() {
  return (
    <Shell as="div" variant="centered" className="mt-0 min-h-screen">
      <ErrorCard
        title="Page Not Found"
        description="The page you are looking for doesn't exist"
        routeLink="/"
        routeName="Go Home"
      />
    </Shell>
  )
}
