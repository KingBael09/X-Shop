import Image from "next/image"
import Link from "next/link"
import type { LayoutProps } from "@/types"
import { Icons } from "@/util/icons"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/ui/aspect-ratio"
import { buttonVariants } from "@/ui/button"

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
      <AspectRatio ratio={16 / 9}>
        <Image
          fill
          priority
          src="https://source.unsplash.com/OS2WODdxy1A"
          alt="A skateboarder doing a high drop"
          className="absolute inset-0 object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60 md:to-background/40" />
        <Link
          href="/"
          className="absolute left-8 top-6 z-20 flex items-center text-lg font-bold tracking-tight"
        >
          <Icons.logo className="mr-2 h-6 w-6" aria-hidden />
          <span>{siteConfig.name}</span>
        </Link>
        <div className="absolute bottom-6 left-8 z-20 line-clamp-1 text-sm">
          Photo by{" "}
          <a
            referrerPolicy="no-referrer"
            target="_blank"
            href="https://unsplash.com/ja/@pixelperfektion?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            className={cn(buttonVariants({ variant: "link" }), "p-0")}
          >
            pixelperfektion
          </a>
          {" on "}
          <a
            referrerPolicy="no-referrer"
            target="_blank"
            href="https://unsplash.com/photos/OS2WODdxy1A?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            className={cn(buttonVariants({ variant: "link" }), "p-0")}
          >
            Unsplash
          </a>
        </div>
      </AspectRatio>
      <main className="container absolute top-1/2 col-span-1 flex -translate-y-1/2 items-center md:static md:top-0 md:col-span-2 md:flex md:translate-y-0 lg:col-span-1">
        {children}
      </main>
    </div>
  )
}

// TODO: There seems to be problem in static site build in `pnpm build --debug` 's log for auth pages
