import Link from "next/link"
import { Icons } from "@/util/icons"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/ui/button"
import { Shell } from "@/components/shells/shell"

import { ThemeToggle } from "../theme-toggle"

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <Shell as="div">
        <section
          id="footer-content"
          aria-labelledby="footer-content-heading"
          className="flex flex-col gap-10 lg:flex-row lg:gap-20"
        >
          <Link
            aria-label="Home"
            href="/"
            className="flex items-center space-x-2"
          >
            <Icons.logo className="size-6" aria-hidden />
            <span className="font-bold">{siteConfig.name}</span>
          </Link>
        </section>
        <section
          id="footer-bottom"
          aria-labelledby="footer-bottom-heading"
          className="flex items-center space-x-4"
        >
          <div className="flex-1 text-left text-sm leading-loose text-muted-foreground">
            Built by{" "}
            <a
              aria-label="Author"
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-semibold transition-colors hover:text-foreground"
            >
              {siteConfig.author}
            </a>
            .
          </div>
          <div className="flex items-center space-x-1">
            <a
              href={siteConfig.links.github}
              // This is an external site
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    size: "icon",
                    variant: "ghost",
                  })
                )}
              >
                <Icons.gitHub className="size-4" aria-hidden />
                <span className="sr-only">GitHub</span>
              </div>
            </a>
            <ThemeToggle />
          </div>
        </section>
      </Shell>
    </footer>
  )
}
