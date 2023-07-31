import { Skeleton } from "@/ui/skeleton"

export default function CreateProductLoading() {
  return (
    <div className="grid w-full max-w-xl gap-6">
      <div className="space-y-2.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10" />
      </div>
      <div className="space-y-2.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-20" />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-6 sm:flex-row">
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10" />
          </div>
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10" />
          </div>
        </div>
      ))}

      <Skeleton className="h-10 space-y-2.5" />
    </div>
  )
}
