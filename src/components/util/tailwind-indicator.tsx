import { env } from "@/env.mjs"

export function TailwindIndicator() {
  if (env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-2 left-2 z-50 flex size-8 items-center justify-center rounded-full bg-secondary p-3 font-mono text-xs text-primary">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
        sm
      </div>
      <div className="hidden md:block lg:hidden xl:hidden 2xl:hidden">md</div>
      <div className="hidden lg:block xl:hidden 2xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  )
}
