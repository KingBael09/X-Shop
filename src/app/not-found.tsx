import { Shell } from "@/components/shell"

import { ErrorCard } from "../components/error-card"

export default function NotFound() {
  return (
    <Shell as="div" variant="centered" className="my-0 min-h-screen p-0">
      <ErrorCard
        title="Page Not Found"
        description="The page you are looking for doesn't exist"
        routeLink="/"
        routeName="Go Home"
      />
    </Shell>
  )
}
