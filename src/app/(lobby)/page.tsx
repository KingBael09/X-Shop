import { siteConfig } from "@/config/site"
import { Shell } from "@/components/shell"

export default function LobbyPage() {
  return (
    <Shell as="div" className="gap-12">
      <div className="grid place-items-center md:min-h-[calc(100vh_-_4rem)]">
        <div className="w-full max-w-4xl py-5">
          <h1
            className="animate-fade-up bg-gradient-to-br from-foreground to-muted bg-clip-text text-center text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-7xl/[6rem]"
            style={{ animationDelay: "0.20s", animationFillMode: "forwards" }}
          >
            {/* Your all-in-one, enterprise ready starting point */}
            {siteConfig.name}, One-stop Solution For All Your Needs
          </h1>
          <p
            className="mt-6 animate-fade-up text-center text-muted-foreground/80 opacity-0 md:text-xl"
            style={{ animationDelay: "0.30s", animationFillMode: "forwards" }}
          >
            Buy and sell products from independent brands and stores around the
            world
          </p>
        </div>
      </div>
      <div>Lmao</div>
    </Shell>
  )
}
