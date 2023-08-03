import { AspectRatio } from "@/ui/aspect-ratio"
import { Card, CardContent, CardFooter, CardHeader } from "@/ui/card"
import { Skeleton } from "@/ui/skeleton"
import { ImagePlaceHolder } from "@/components/no-image"

export default function CategoryLoading() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="border-b p-0">
              <AspectRatio ratio={1}>
                <ImagePlaceHolder className="aspect-square" />
              </AspectRatio>
            </CardHeader>
            <CardContent className="grid gap-2.5 p-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-between">
                <Skeleton className="h-9 w-full rounded-sm" />
                <Skeleton className="h-9 w-full rounded-sm" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
