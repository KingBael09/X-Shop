import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Shell } from "@/components/shell"

export default function LobbyPage() {
  return (
    <Shell as="div" className="gap-6">
      <section
        aria-label="hero-heading"
        className="grid place-items-center md:min-h-[calc(var(--navbar-page-offset)_-_2rem)]"
      >
        <div className="grid w-full max-w-4xl place-items-center gap-6 py-5">
          <h1
            className="animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-center text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-7xl/[6rem]"
            style={{ animationDelay: "0.20s", animationFillMode: "forwards" }}
          >
            {siteConfig.name}, One-stop Solution For All Your Needs
          </h1>
          <p
            className="w-full max-w-xl animate-fade-up text-center text-muted-foreground/80 opacity-0 md:text-xl"
            style={{ animationDelay: "0.30s", animationFillMode: "forwards" }}
          >
            Buy and sell products from independent brands and stores around the
            world
          </p>
          <div
            className="flex animate-fade-up gap-4 opacity-0"
            style={{ animationDelay: "0.30s", animationFillMode: "forwards" }}
          >
            <Link className={cn(buttonVariants(), "px-8")} href="/products">
              Buy Now
            </Link>
            <Link
              className={cn(buttonVariants({ variant: "outline" }), "px-8")}
              href="/dashboard/stores"
            >
              Sell Now
            </Link>
          </div>
        </div>
      </section>
      <section>Lmao</section>
    </Shell>
  )
}
