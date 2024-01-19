"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import type { StoredFile } from "@/types"
import { Icons } from "@/util/icons"
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"

import { cn } from "@/lib/utils"
import { Button } from "@/ui/button"

import { ImagePlaceHolder } from "../no-image"

//? See: https://www.embla-carousel.com

interface ProductImageCarouselProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  images: StoredFile[]
  options?: EmblaOptionsType
  placeHolderProps?: React.HtmlHTMLAttributes<HTMLDivElement>
}

export function ProductImageCarousel({
  images,
  options,
  className,
  children,
  placeHolderProps,
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
    return (
      <ImagePlaceHolder
        {...placeHolderProps}
        className={cn("aspect-square md:w-1/2", placeHolderProps?.className)}
      />
    )
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
          {children}
        </div>
      </div>
      {images.length > 1 ? (
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="mr-0.5 aspect-square size-7 rounded-none sm:mr-2 sm:size-8"
            onClick={scrollPrev}
          >
            <Icons.chevronLeft className="size-3 sm:size-4" aria-hidden />
            <span className="sr-only">Previous slide</span>
          </Button>
          {images.map((image, i) => (
            <Button
              key={i}
              variant="outline"
              size="icon"
              className={cn(
                "group relative aspect-square size-full max-w-[100px] rounded-none shadow-sm hover:bg-transparent focus-visible:ring-foreground",
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
            className="ml-0.5 aspect-square size-7 rounded-none sm:ml-2 sm:size-8"
            onClick={scrollNext}
          >
            <Icons.chevronRight className="size-3 sm:size-4" aria-hidden />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      ) : null}
    </div>
  )
}

// TODO:Set a loader while the image is loading -> Plaiceholder? or blur data url
