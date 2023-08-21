import { env } from "@/env.mjs"

export interface FooterItem {
  heading: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

const links = {
  twitter: "https://twitter.com/_singh_jayesh",
  github: "https://github.com/KingBael09",
  linkedIn: "https://www.linkedin.com/in/singhjayesh/",
}

export const repo = "https://github.com/KingBael09/X-Shop"

export const siteConfig = {
  name: "X-Shop",
  description: "X-Shop, One shop for all your needs!",
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: "https://example.com/opengraph-image.png",
  links,
  keywords: ["Next.js", "React", "Tailwind CSS", "Server Components"],
  author: "KingBael",
}

export const footerNav = [
  {
    heading: "Credits",
    items: [
      {
        title: "SandMan",
        href: "https://twitter.com/sadmann17",
        external: true,
      },

      {
        title: "OneStopShop",
        href: "https://onestopshop.jackblatch.com",
        external: true,
      },
      {
        title: "Acme Corp",
        href: "https://acme-corp.jumr.dev",
        external: true,
      },
      {
        title: "Taxonomy",
        href: "https://tx.shadcn.com/",
        external: true,
      },
      {
        title: "shadcn/ui",
        href: "https://ui.shadcn.com",
        external: true,
      },
    ],
  },
  {
    heading: "Help",
    items: [
      {
        title: "About",
        href: "/about",
        external: false,
      },
      {
        title: "Contact",
        href: "/contact",
        external: false,
      },
      {
        title: "Terms",
        href: "/terms",
        external: false,
      },
      {
        title: "Privacy",
        href: "/privacy",
        external: false,
      },
    ],
  },
  {
    heading: "Socials",
    items: [
      {
        title: "Twitter",
        href: links.twitter,
        external: true,
      },
      {
        title: "GitHub",
        href: links.github,
        external: true,
      },
      {
        title: "LinkedIn",
        href: links.linkedIn,
        external: true,
      },
    ],
  },
] satisfies FooterItem[]

export const FreeTierStoreLimit = 3

/**
 * This determines the filter price range for the products
 */
export const filterPriceRange = {
  lower: 0,
  upper: 10000,
  step: 500, // determines the step size of the slider
}
