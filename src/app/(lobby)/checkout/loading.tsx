import { Skeleton } from "@/ui/skeleton"
import { ImagePlaceHolder } from "@/components/no-image"
import { Shell } from "@/components/shells/shell"
import { Card } from "@/components/ui/card"

export default function CheckoutLoading() {
  return (
    <Shell>
      <div className="grid gap-1">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-52" />
      </div>
      <div className="flex flex-col-reverse gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-8 lg:border-r lg:border-accent lg:pr-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="grid gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
          <div className="grid gap-2">
            <Skeleton className="h-5 w-24" />
            <span className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="flex gap-1">
                  <Skeleton className="size-5" />
                  <Skeleton className="h-5 w-20" />
                </span>
              ))}
            </span>
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-28 w-full" />
          </div>
        </div>
        <div className="grid flex-1 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex overflow-hidden">
              <ImagePlaceHolder className="aspect-square w-32" />
              <div className="flex flex-1 flex-col gap-3 p-6 md:flex-row">
                <div className="grid gap-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-2 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="my-auto md:mx-auto">
                  <Skeleton className="h-8 w-40" />
                </div>
              </div>
            </Card>
          ))}
          <Card className="my-2 flex justify-between p-6">
            <div className="my-auto flex">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="ml-2 size-8" />
            </div>
            <Skeleton className="h-8 w-32" />
          </Card>
        </div>
      </div>
    </Shell>
  )
}
