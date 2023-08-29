"use client"

import { useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Icons } from "@/util/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/ui/button"

import { useProductLayoutContext } from "./product-layout-provider"

interface PaginationButtonProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  pageCount: number
  siblingCount?: number
}

export function PaginationButton({
  pageCount,
  siblingCount = 1,
  className,
  ...props
}: PaginationButtonProps) {
  const router = useRouter()
  const pathname = usePathname()

  const { params, isPending, startTransition, createQueryString } =
    useProductLayoutContext()

  const { per_page, page, sort } = params

  //  Memoizing pagination value to avoid rerendering
  const paginationRange = useMemo(() => {
    const delta = siblingCount + 2

    const range = []
    for (
      let i = Math.max(2, Number(page) - delta);
      i <= Math.min(pageCount - 1, Number(page) + delta);
      i++
    ) {
      range.push(i)
    }

    if (Number(page) - delta > 2) {
      range.unshift("...")
    }
    if (Number(page) + delta < pageCount - 1) {
      range.push("...")
    }

    range.unshift(1)
    if (pageCount !== 1) {
      range.push(pageCount)
    }

    return range
  }, [pageCount, page, siblingCount])

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2",
        className
      )}
      {...props}
    >
      <Button
        aria-label="Go to first page"
        variant="outline"
        size="icon"
        className="hidden h-8 w-8 lg:flex"
        onClick={() => {
          startTransition(() => {
            router.push(
              `${pathname}?${createQueryString({
                page: 1,
                per_page: per_page ?? null,
                sort,
              })}`
            )
          })
        }}
        disabled={Number(page) === 1 || isPending}
      >
        <Icons.chevronsLeft className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        aria-label="Go to previous page"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          startTransition(() => {
            router.push(
              `${pathname}?${createQueryString({
                page: Number(page) - 1,
                per_page: per_page ?? null,
                sort,
              })}`
            )
          })
        }}
        disabled={Number(page) === 1 || isPending}
      >
        <Icons.chevronLeft className="h-4 w-4" aria-hidden="true" />
      </Button>
      {paginationRange.map((pageNumber, i) =>
        pageNumber === "..." ? (
          <Button
            aria-label="Page separator"
            key={i}
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled
          >
            ...
          </Button>
        ) : (
          <Button
            aria-label={`Page ${pageNumber}`}
            key={i}
            variant={Number(page) === pageNumber ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              startTransition(() => {
                router.push(
                  `${pathname}?${createQueryString({
                    page: pageNumber,
                    per_page: per_page ?? null,
                    sort,
                  })}`
                )
              })
            }}
            disabled={isPending}
          >
            {pageNumber}
          </Button>
        )
      )}
      <Button
        aria-label="Go to next page"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          startTransition(() => {
            router.push(
              `${pathname}?${createQueryString({
                page: Number(page) + 1,
                per_page: per_page ?? null,
                sort,
              })}`
            )
          })
        }}
        disabled={Number(page) === (pageCount ?? 10) || isPending}
      >
        <Icons.chevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        aria-label="Go to last page"
        variant="outline"
        size="icon"
        className="hidden h-8 w-8 lg:flex"
        onClick={() => {
          router.push(
            `${pathname}?${createQueryString({
              page: pageCount ?? 10,
              per_page: per_page ?? null,
              sort,
            })}`
          )
        }}
        disabled={Number(page) === (pageCount ?? 10) || isPending}
      >
        <Icons.chevronsRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
