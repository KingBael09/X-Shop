import Link from "next/link"

import type { Store } from "@/lib/db/schema"
import { getRandomPatternStyle } from "@/lib/svg-patterns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"

import { AspectRatio } from "./ui/aspect-ratio"

type StoreType = Pick<Store, "id" | "name" | "description">

interface StoreCardProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  store: StoreType
  link?: string
  text?: string
}

export function StoreCard({
  store,
  link: path,
  children,
  ...props
}: StoreCardProps) {
  const link = path ?? `/products?store_ids=${store.id}`

  return (
    <Card key={store.id} className="flex h-full flex-col" {...props}>
      <Link aria-label={`${store.name} store products`} href={link}>
        <AspectRatio ratio={4} className="relative">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-background to-background/30" />
          <div
            className="h-full rounded-t-md "
            style={getRandomPatternStyle(String(store.id))}
          />
        </AspectRatio>
        <CardHeader className="flex-1 pt-0">
          <CardTitle className="line-clamp-1">{store.name}</CardTitle>
          {store.description && (
            <CardDescription className="line-clamp-2">
              {store.description}
            </CardDescription>
          )}
        </CardHeader>
      </Link>
      {children ? <CardContent>{children}</CardContent> : null}
    </Card>
  )
}
