import { Modal } from "@/components/modal/modal"
import { ImagePlaceHolder } from "@/components/no-image"
import { Skeleton } from "@/components/ui/skeleton"

const HeaderLoading = (
  <div className="grid w-full gap-2">
    <Skeleton className="h-8 w-2/3" />
    <Skeleton className="h-5 w-1/3" />
  </div>
)

export default function ProductPreviewLoading() {
  return (
    <Modal title={HeaderLoading}>
      <div className="w-full md:px-3">
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
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
      </div>
    </Modal>
  )
}
