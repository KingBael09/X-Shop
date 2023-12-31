import { type MetadataRoute } from "next"

import { absoluteUrl } from "@/lib/utils"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/dashboard/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}

// TODO: Add a CRON Job to remove dpulicate files/ unwanted files periodically from uploadthing

// TODO: Change product-placeholder.webp
