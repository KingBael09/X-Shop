import { NavItem } from "@/components/layouts/nav"

interface DashboardConfig {
  sidebarNav: NavItem[]
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Account",
      href: "/dashboard/account",
      icon: "user",
      description: "Manage your Account",
      //   items: [],
    },
    {
      title: "Stores",
      href: "/dashboard/stores",
      icon: "store",
      description: "Manage your Stores",
      //   items: [],
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
      description: "Manage your Bills",
      //   items: [],
    },
    {
      title: "Purchases",
      href: "/dashboard/purchases",
      icon: "dollarSign",
      description: "Manage your Purchases",
      //   items: [],
    },
  ],
}
