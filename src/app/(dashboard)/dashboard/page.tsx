import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/ui/card"

import { dashboardConfig } from "@/config/dashboard"
import { Icons } from "@/components/util/icons"

export default function DashboardPage() {
  return (
    <div className="absolute inset-0 z-20 bg-background">
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3">
        <Link href="/dashboard">
          <Card className="bg-accent/50 hover:bg-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.dashboard className="h-6 w-6" />
                Dashboard
              </CardTitle>
              <CardDescription>Your Dashboard</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        {dashboardConfig.sidebarNav.map((item) => {
          const Icon = Icons[item.icon ?? "chevronLeft"]
          return (
            <Link key={item.title} href={item.href}>
              <Card className="hover:bg-accent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-6 w-6" />
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
