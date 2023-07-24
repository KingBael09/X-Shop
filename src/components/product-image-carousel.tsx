"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import type { StoredFile } from "@/types"
import useEmblaCarousel, {
  type EmblaCarouselType,
  type EmblaOptionsType,
} from "embla-carousel-react"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/ui/aspect-ratio"
import { Button } from "@/ui/button"
import { Icons } from "@/components/util/icons"

import { ImagePlaceHolder } from "./no-image"
import { Zoom } from "./zoom-image"

//? See: https://www.embla-carousel.com

interface ProductImageCarouselProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  images: StoredFile[]
  options?: EmblaOptionsType
}

export function ProductImageCarousel({
  images,
  options,
  className,
  ...props
}: ProductImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ ...options, loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  )
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  )

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowLeft") {
        scrollPrev()
      } else if (e.key === "ArrowRight") {
        scrollNext()
      }
    },
    [scrollNext, scrollPrev]
  )

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on("init", onSelect)
    emblaApi.on("select", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  if (images.length === 0) {
    return <ImagePlaceHolder className="aspect-square md:w-[50%]" />
  }
  return (
    <div
      aria-label="Product image carousel"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div
          className="-ml-4 flex touch-pan-y"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          {images.map((image, index) => (
            <div className="relative min-w-0 flex-full pl-4" key={index}>
              <Zoom margin={10}>
                <AspectRatio ratio={1}>
                  <Image
                    fill
                    key={index}
                    // unoptimized
                    role="group"
                    src={image.url}
                    alt={image.name}
                    priority={index === 0}
                    className="!cursor-default object-cover md:object-contain"
                    aria-label={`Slide ${index + 1} of ${images.length}`}
                    sizes="100vw"
                    aria-roledescription="slide"
                  />
                </AspectRatio>
              </Zoom>
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 ? (
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="mr-0.5 aspect-square h-7 w-7 rounded-none sm:mr-2 sm:h-8 sm:w-8"
            onClick={scrollPrev}
          >
            <Icons.chevronLeft className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden />
            <span className="sr-only">Previous slide</span>
          </Button>
          {images.map((image, i) => (
            <Button
              key={i}
              variant="outline"
              size="icon"
              className={cn(
                "group relative aspect-square h-full w-full max-w-[100px] rounded-none shadow-sm hover:bg-transparent focus-visible:ring-foreground",
                i === selectedIndex && "ring-1 ring-foreground"
              )}
              onClick={() => scrollTo(i)}
              onKeyDown={handleKeyDown}
            >
              <div className="absolute inset-0 z-10 bg-zinc-950/20 group-hover:bg-zinc-950/40" />
              <Image
                src={image.url}
                alt={image.name}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                fill
              />
              <span className="sr-only">
                Slide {i + 1} of {images.length}
              </span>
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="ml-0.5 aspect-square h-7 w-7 rounded-none sm:ml-2 sm:h-8 sm:w-8"
            onClick={scrollNext}
          >
            <Icons.chevronRight className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      ) : null}
    </div>
  )
}

// TODO:Set a loader while the image is loading
// TODO: Maybe this could be optimized by taking image renderere outside
