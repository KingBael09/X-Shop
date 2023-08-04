import { ImagePlaceHolder } from "../no-image"
import { AspectRatio } from "../ui/aspect-ratio"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

interface ProductCardLoaderProps {
  actions?: boolean
}

export function ProductCardLoader({ actions = false }: ProductCardLoaderProps) {
  return (
    <Card className="min-w-[260px] rounded-sm">
      <CardHeader className="border-b p-0">
        <AspectRatio ratio={1}>
          <ImagePlaceHolder />
        </AspectRatio>
      </CardHeader>
      <CardContent className="grid gap-2.5 p-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </CardContent>
      {actions && (
        <CardFooter className="flex gap-2 p-4 pt-0">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      )}
    </Card>
  )
}
