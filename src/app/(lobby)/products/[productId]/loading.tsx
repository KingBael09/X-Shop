import { Separator } from "@/ui/separator"
import { Skeleton } from "@/ui/skeleton"
import { ImagePlaceHolder } from "@/components/no-image"
import { ProductCardLoader } from "@/components/product/product-card-loader"

export default function ProductLoading() {
  return (
    <>
      <div className="flex items-center space-x-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-14" />
        ))}
      </div>
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <div className="w-full md:w-1/2">
          <div className="flex flex-col gap-2">
            <ImagePlaceHolder className="aspect-square" />
            <div className="flex w-full items-center justify-center gap-2">
              <Skeleton className="size-7 rounded-none" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="aspect-square size-full max-w-[100px] rounded-none"
                />
              ))}
              <Skeleton className="size-7 rounded-none" />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-2">
            <Skeleton className="h-9 w-1/2" />
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-6 w-1/4" />
          </div>
          <Separator className="my-1.5" />
          <div className="grid gap-4 sm:max-w-[240px]">
            <div className="grid space-y-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-9 w-full" />
            </div>
            <Skeleton className="h-9 w-full" />
          </div>
          <Separator className="mb-2.5 mt-5" />
          <div className="flex items-center">
            <Skeleton className="h-7 w-1/4" />
            <Skeleton className="ml-auto size-4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Separator className="mt-2.5" />
        </div>
      </div>
      <div className="overflow-hidden md:pt-6">
        <Skeleton className="h-9 w-14" />
        <div className="overflow-x-auto pb-2 pt-6">
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardLoader key={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
